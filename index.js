const TelegramBot = require("node-telegram-bot-api")

// replace the value below with the Telegram token you receive from @BotFather
const token = "2144058425:AAGEvYI1I8O1QnFGiFPHJm9vEEOXv567gl8"

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true })

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id
  const resp = match[1] // the captured "whatever"
  console.log()
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp)
})
// Listen for any kind of message. There are different kinds of
// messages.
const listUsers = {}
const host_id = 1628313190
bot.on("message", (msg) => {
  const chatId = msg.chat.id
  const chatFromId = msg.from.id
  const entity = {
    id: msg.from.id,
    fullName: [msg.from.first_name, msg.from.last_name].join(" "),
  }
  console.log(entity)
  let str = msg.text.toLowerCase()
  if (entity.id === host_id) {
    handleHostCommand(str, chatId)
  } else {
    handleUserCommand(str, entity)
  }
  //bot.sendMessage(listFrom[0], str)
})
let currentQuestion = 0


const listQuestion = [
{
    question: `
        1. Cổng mặc định của SSH là bao nhiêu ?
A: 3306
B: 20
C: 80
D: 22
        `,
    correct: "d",
},
{
    question: `
        2. Muốn cho phép truy cập tài nguyên từ một domain khác thì ta cần setting trường gì ở Response Headers
A: access-control-allow-credentials
B: content-type
C: access-control-allow-origin
D: server
        `,
    correct: "c",
},
{
    question: `
        3. Singleton là mẫu design pattern thuộc nhóm nào
A: Nhóm khởi tạo
B: Nhóm cấu trúc
C: Nhóm hành vi
D: Cả ba nhóm trên
        `,
    correct: "a",
},
{
    question: `
        4. JWT hiện tại của AdminV2 được mã hóa bằng thuật toán gì
A: RS256
B: RS512
C: HS256
D: HS512
        `,
    correct: "c",
},
{
    question: `
        5. Composite là mẫu design pattern thuộc nhóm nào ?
A: Nhóm khởi tạo
B: Nhóm cấu trúc
C: Nhóm hành vi
D: Cả ba nhóm trên
        `,
    correct: "b",
},
{
    question: `
        6. 1 + 2 + 3 + 4 + .... + 99 = ?
A: 4950
B: 5050
C: 4850
D: 5000
        `,
    correct: "a",
},
{
    question: `
        7. Điền số tiếp theo của dãy: 4, 6, 10, 14, 22, 26, 34, 38, ...
A: 44
B: 46
C: 48
D: 50
        `,
    correct: "b",
},
{
    question: `
        8. Trong docker-compose ta muốn export cổng của nginx từ container thành port 8000 thì ta làm như thế nào ?
A: ports: "8000:80"
B: ports: "80:80"
C: ports: "8000:8000"
D: ports: "80:8000"
        `,
    correct: "a",
},
{
    question: `
        9. Trong Restful API status code thành công có dạng
A: 200-299
B: 300-399
C: 400-499
D: 500-599
        `,
    correct: "a",
},
{
    question: `
        10. Trong Restful API status code server error có dạng
A: 200-299
B: 300-399
C: 400-499
D: 500-599
        `,
    correct: "d",
}
]
let currentState = {
  timeStart: null,
  answer: {},
}

const handleHostCommand = (str, chatId) => {
  switch (str) {
    case "start":
      bot.sendMessage(chatId, `Start game
EKS-1: Đề gồm 10 câu hỏi
`);
      handleStartGame(chatId)
      break
    case "next":
      currentState = {
        timeStart: null,
        answer: {},
      }
      currentQuestion++
      sendQuestion(chatId)
      break
  }
}

const sendQuestion = (chatId) => {
  const question = listQuestion[currentQuestion - 1]
  const time = 20 * 1000
  if (question) {
    bot.sendMessage(chatId, question.question)
    currentState.timeStart = new Date()
    setTimeout(() => {
      bot.sendMessage(chatId, `Đáp án đúng: ${question.correct.toUpperCase()}`)
      // Handle show điểm
      console.log(currentState)
      // Xử lý cộng điểm
      Object.keys(currentState.answer).forEach((e) => {
        const target = currentState.answer[e]
        let score = 0
        if (target.answer === question.correct) {
          // Trả lời đúng
          const timeEnd = new Date(+currentState.timeStart + 20 * 1000)
          const sub = Math.max(Math.round((timeEnd - target.time) / 200), 0);
          score = sub
        }
        if (listUsers[e]) {
          listUsers[e] = {
            score: listUsers[e].score + score,
            fullName: target.entity.fullName,
          }
        } else {
          listUsers[e] = {
            score: score,
            fullName: target.entity.fullName,
          }
        }
      })
      // Show điểm
      const bxh = Object.values(listUsers)
        .sort((a, b) => b.score - a.score)
        .map((e, i) => {
          return `${i + 1}. ${e.fullName} : ${e.score}`
        }).join`\n`
      bot.sendMessage(
        chatId,
        `Bảng xếp hạng:
${bxh}
`
      )
    }, time)
  } else {
    // End of question
  }
}

const handleUserCommand = (str, entity) => {
  const answer = str.toLowerCase();
  if("abcd".includes(answer))
  currentState.answer[entity.id] = {
    answer,
    time: new Date(),
    entity,
  }
}
