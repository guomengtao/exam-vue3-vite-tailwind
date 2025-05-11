// 状态格式化
export const formatStatus = (status) => {
    return status === 1 ? '已发布' : '未发布'
  }
  
  // 题型格式化
  export const formatQuestionType = (type) => {
    const types = {
      single: '单选题',
      multi: '多选题',
      judge: '判断题'
    }
    return types[type] || '未知题型'
  }