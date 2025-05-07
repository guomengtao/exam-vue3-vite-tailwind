const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

export default function arrayToLetter(questions: any[]): any[] {
  return questions.map((q) => {
    const newQuestion = { ...q }

    const getIndex = (opt: string) => q.options.indexOf(opt)
    const toLetter = (index: number) => optionLetters[index] || ''

    if (q.type === 'multi' && Array.isArray(q.correct_answer)) {
      newQuestion.correct_answer = q.correct_answer
        .map(getIndex)
        .filter(index => index !== -1)
        .sort((a, b) => a - b)
        .map(toLetter)
        .join(',')
    } else if (q.type === 'single' && typeof q.correct_answer === 'string') {
      const index = getIndex(q.correct_answer)
      newQuestion.correct_answer = index !== -1 ? toLetter(index) : ''
    }

    return newQuestion
  })
}