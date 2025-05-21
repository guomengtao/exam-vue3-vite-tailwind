以下是为你定制的一份 Redis 高并发任务处理方案的 Markdown 文档，包含命名规范、结构说明、推荐使用顺序，以及具体的读写样例，非常适合用作项目内的 docs/RedisTaskQueue.md 文档。

⸻



# Redis 高并发任务处理结构设计文档

## 📌 目标场景

用于支撑 **万人并发考试**系统的后台数据处理任务队列，例如考试成绩写入、日志任务处理、异步提交保存等任务。

---

## 📂 结构组成

| 名称             | 类型     | 内容描述                                 | 删除规则      | 用途                           |
|------------------|----------|------------------------------------------|----------------|--------------------------------|
| `task:details`   | Hash     | 所有任务的详情数据（key 为 ID）          | 永不删除      | 存储完整任务数据               |
| `task:queue`     | List     | 待处理任务 ID 队列（FIFO 顺序）          | 处理完即删     | 等待消费任务                   |
| `task:done`      | Set      | 已处理任务 ID 去重记录                   | 永不删除      | 幂等防重 / 可查处理数量        |
| `task:timeline`  | ZSet     | 任务 ID => 时间戳（score 为 Unix 时间）  | 可滑动窗口删除 | 时间区间统计、监控趋势         |

---

## 🧠 推荐使用顺序

1. **任务生成时**
   - 将详情写入 `task:details`
   - 将 ID 加入 `task:queue`
   - 将 ID 加入 `task:timeline`，score 为当前时间戳

2. **任务消费时**
   - 从 `task:queue` 中 `LPOP`
   - 从 `task:details` 读取内容处理
   - 处理成功后，将 ID 加入 `task:done`

3. **进度展示**
   - `LLEN task:queue` ➜ 查看未处理条数
   - `SCARD task:done` ➜ 查看已完成条数
   - `ZCOUNT task:timeline min max` ➜ 时间区间内任务量

---

## 💡 命名建议

统一使用前缀，如：

| 类型   | Redis Key 示例           |
|--------|---------------------------|
| Hash   | `task:details`            |
| List   | `task:queue`              |
| Set    | `task:done`               |
| ZSet   | `task:timeline`           |

如需分模块可命名为 `exam:task:*`。

---

## ✍️ 写入样例（任务生成）

```go
// 示例数据
id := "task_001"
data := map[string]string{
    "exam_id": "15",
    "user_id": "12",
    "username": "tom",
    "score": "88",
    "created_at": strconv.FormatInt(time.Now().Unix(), 10),
}

// 写入 hash
rdb.HSet(ctx, "task:details", id, jsonData)

// 加入 list 队列
rdb.RPush(ctx, "task:queue", id)

// 加入 timeline
rdb.ZAdd(ctx, "task:timeline", redis.Z{
    Score:  float64(time.Now().Unix()),
    Member: id,
})



⸻

🧾 读取样例（任务消费）

// 从队列中弹出
id, _ := rdb.LPop(ctx, "task:queue").Result()

// 查详情
detail, _ := rdb.HGet(ctx, "task:details", id).Result()

// 处理后，加入已完成集合
rdb.SAdd(ctx, "task:done", id)



⸻

📊 统计示例（展示进度）

// 剩余任务
rdb.LLen(ctx, "task:queue")

// 已完成任务数
rdb.SCard(ctx, "task:done")

// 查询最近 10 分钟任务量
now := time.Now().Unix()
tenMinAgo := now - 600
rdb.ZCount(ctx, "task:timeline", fmt.Sprint(tenMinAgo), fmt.Sprint(now))



⸻

⏳ 滑动窗口清理（可选）

为控制内存占用，ZSet 可定期清除旧数据：

// 每小时清一次，保留最近 24 小时数据
expireBefore := time.Now().Unix() - 86400
rdb.ZRemRangeByScore(ctx, "task:timeline", "0", fmt.Sprint(expireBefore))



⸻

✅ 总结
	•	本方案使用 List + Hash + Set + ZSet 四结构组合。
	•	支持任务并发生成、顺序消费、去重处理、实时监控。
	•	可灵活扩展为多队列、多业务场景，并易于 Grafana/Prometheus 接入监控。

⸻

📁 建议文件位置

将此文件命名为：

docs/RedisTaskQueue.md

便于团队成员查看任务设计方案、对接与开发。

---

如果你需要配套的代码样例（如持续写入模拟器、消费者、监控脚本等），也可以告诉我：

- ✅ 需要写入模拟器
- ✅ 需要消费任务的 Worker 示例
- ✅ 需要 Redis 可视化监控脚本（带图）

我可以逐一帮你补上。是否继续？

你的这个思路非常清晰，而且也非常成熟——你已经不是在讨论“能不能运行”，而是在讨论“怎么监控运行得好不好”，这正是一个高并发系统逐步走向稳定、可靠、可观测的关键阶段。

⸻

✅ 总体目标总结

你目前希望解决两个监控问题：
	1.	Redis 写入模拟器是否在工作？当前写入速率、条数是多少？
	2.	MySQL 写入消费器当前是否运行中？写入频率是否饱和？MySQL 写入压力如何？

⸻

🔍 方案一览（建议实现方式）

项目	监控目标	监控指标	建议实现方式
Redis 写入模拟器	是否在运行、写入频率	最后一条写入时间、总写入数、写入速率	定期记录心跳到 Redis + 提供接口查询
MySQL 消费器 Worker	是否在运行、消费速率	最后一条入库时间、入库速率、每次耗时	Worker 记录运行状态到 Redis + 提供接口查询
Redis 队列状态	任务堆积数量	LLEN	Redis 本身查询即可
MySQL 饱和度	并发连接、执行时间、错误率	SHOW STATUS, SHOW PROCESSLIST, 慢查询数量	提供一个 /api/monitor/mysql 接口返回分析数据



⸻

📘 示例设计方案：监控器模块说明

1. 模拟器写入监控

记录方式（在写入循环中加入）：

// 每 N 次写入或每 X 秒记录心跳
rdb.Set(ctx, "simulator:heartbeat", time.Now().Unix(), 0)
rdb.Incr(ctx, "simulator:written:total")

接口返回示例 /api/monitor/simulator：

{
  "status": "running",
  "last_write_time": 1747387267,
  "written_total": 452000,
  "write_rate_per_min": 2000
}



⸻

2. Worker 消费器监控

记录方式（每次处理成功后）：

rdb.Set(ctx, "consumer:heartbeat", time.Now().Unix(), 0)
rdb.Incr(ctx, "consumer:processed:total")
rdb.Set(ctx, "consumer:last_duration", duration.Milliseconds(), 0)

接口返回示例 /api/monitor/consumer：

{
  "status": "running",
  "last_process_time": 1747387288,
  "processed_total": 448888,
  "avg_process_duration_ms": 35
}



⸻

3. MySQL 压力监控

你可以通过 Go 的数据库驱动连接执行以下 SQL：

SHOW GLOBAL STATUS LIKE 'Threads_connected';
SHOW GLOBAL STATUS LIKE 'Connections';
SHOW GLOBAL STATUS LIKE 'Slow_queries';

结合 Redis 队列的长度 LLEN task:queue 一起提供一个综合接口 /api/monitor/mysql：

{
  "connections": 38,
  "threads_connected": 22,
  "slow_queries": 1,
  "queue_length": 1821
}



⸻

🧱 技术建议

✅ 推荐技术组件
	•	监控数据记录：Redis 存储心跳、数值、速率
	•	监控接口展示：使用 Go Gin + Axios + Vue 前台页面实时刷新
	•	定时任务可视化调度器（可选）：可以考虑集成 cron + dashboard 或轻量级任务管理界面

⸻

🔁 展示页面建议（你可以自己做个小后台页面）

模块	当前状态	总数	最近更新时间	速率
Redis 模拟器	🟢运行中	452000	2 秒前	300 条/秒
MySQL Worker	🟢运行中	448888	1 秒前	35ms/条
Redis 待处理队列	-	1821	-	-
MySQL 连接数	-	38	-	-



⸻

✅ 下一步建议

你可以告诉我是否要我帮你：
	•	写一个 /api/monitor/simulator 的 Go 接口
	•	写一个 Vue 页面实时展示这些状态（带刷新图标）
	•	写一个 Redis 的指标收集模块（每分钟统计记录）

我们可以一个个来做。你想从哪个开始？或者我也可以把整套基础监控骨架写出来。


你的疑问非常关键，我们来仔细拆解一下你提到的两个问题：

⸻

✅ 1. 写入速率（Redis 模拟器）是怎么算出来的？

这个是我们自己定义和计算的指标，不是 Redis 自动提供的。

实现方式（推荐）：

我们手动统计：
	•	用 rdb.Incr("simulator:written:total") 累积总写入数
	•	每分钟定时记录一次快照，例如：

// 每分钟定时执行
prevCount := redis.Get("simulator:written:last_minute").Int()
currCount := redis.Get("simulator:written:total").Int()
rate := currCount - prevCount // 每分钟新增数量
redis.Set("simulator:written:rate", rate, time.Minute)
redis.Set("simulator:written:last_minute", currCount, 0)

你也可以记录一个滑动窗口的数据（例如最近 5 分钟内每分钟的写入数），用于绘图。

⸻

✅ 2. 入库速率 / 每次耗时（MySQL 消费器）怎么算？

这也是你写程序时记录的，不是 MySQL 自动给出的，MySQL 只负责执行，不知道你“是不是处理 Redis 消息”这种语义。

实现方式：

在你写 Redis → MySQL 的消费逻辑中包裹计时代码：

start := time.Now()

// 处理 Redis 一条数据，插入 MySQL
err := processItem(data)

duration := time.Since(start).Milliseconds()
rdb.Set("consumer:last_duration", duration, 0)
rdb.Incr("consumer:processed:total")

补充：

你可以用一个列表或滑动窗口存多条 duration，用于计算平均值：

// 把 duration 存进 Redis List
rdb.LPush("consumer:durations", duration)
rdb.LTrim("consumer:durations", 0, 19) // 只保留最近 20 条

// 然后在接口里 LPUSH + 取平均
durations, _ := rdb.LRange("consumer:durations", 0, -1).Result()
avg := 平均值(durations)



⸻

🔍 小结对比

指标	数据来源	是否内置	备注
写入时间	自己写入 Redis 时间戳	❌	每次写的时候用 rdb.Set(...)
写入速率	自己计算	❌	每分钟记录差值
入库时间	自己记录时间戳	❌	每次消费后写入 Redis
每次耗时	用 time.Since(...) 计算	❌	可以统计平均值
Redis 队列长度	LLEN 命令	✅	Redis 原生命令支持
MySQL 连接数	SHOW STATUS	✅	MySQL 原生命令



⸻

✅ 接口设计建议（示意）

{
  "simulator": {
    "status": "running",
    "last_write_time": 1747387267,
    "write_rate_per_min": 3000
  },
  "consumer": {
    "status": "running",
    "last_process_time": 1747387288,
    "processed_total": 448888,
    "avg_process_duration_ms": 38
  },
  "queue_length": 1821,
  "mysql": {
    "connections": 43,
    "threads_connected": 30,
    "slow_queries": 1
  }
}



⸻

✅ 总结
	•	所有速率 / 耗时类指标，都需要你在程序中自己记录和维护
	•	Redis 本身只提供“数量”类数据（长度、KEY 数）
	•	MySQL 只提供连接状态、慢查询等系统信息

如果你想要我现在就帮你写一个 Go 示例（比如模拟器那边的速率监控写法），我可以立刻生成代码。你要不要现在就开始这一块？