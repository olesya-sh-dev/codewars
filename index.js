// У нас есть склад, на котором лежат тканевые маски разных размеров.
// type Store = Array<{
//   size: number
//   quantity: number
// }>

// На склад приходит заказ, который содержит id покупателей и один или два размера тканевой маски,
// которые ему подходят. Причем второй размер, если он есть, на единицу больше первого.
// Если покупателю подходят 2 размера, то он дополнительно указывает приоритетный размер (masterSize),
// который он хотел бы получить, s1, если приоритетным размером является первый и s2, если второй.
// type Order = Array<{
//   id: number
//   size: [number]
// } | {
//   id: number
//   size: [number, number]
//   masterSize: "s1" | "s2"
// }>
// Необходимо написать функцию process, которая первым аргументом принимает sore: Store, вторым - order: Order
// и возвращает:
// - false, если склад не сможет обработать данный заказ (например, на складе нет подходящих размеров);
// - объект Result, если заказ можно обработать, выдав всем подходящий размер.
// type Result = {
//   stats: Array<{ size: number, quantity: number }>
//   assignment: Array<{ id: number, size: number }>
//   mismatches: number
// }
// где stats - отсортированный по возрастанию размеров массив, содержащий информацию о выданных размерах и их кол-ве;
// assignment - массив, содержащий сведения о том, кто какой размер получил
// mismatches - кол-во покупателей, у которых выданный размер НЕ совпал с приоритетным.

// Yaroslaw </> 20:08
// const process = (store, order) => {

// }

// const tests = [
//   {
//     store: [{ size: 2, quantity: 1 }],
//     order: [{ id: 102, size: [1, 2], masterSize: "s1" }],
//     isPossible: true,
//     mismatches: 1,
//   },
//   {
//     store: [{ size: 3, quantity: 1 }],
//     order: [{ id: 102, size: [1, 2], masterSize: "s1" }],
//     isPossible: false,
//     mismatches: 0,
//   },
//   {
//     store: [{ size: 2, quantity: 4 }],
//     order: [
//       { id: 101, size: [2] },
//       { id: 102, size: [1, 2], masterSize: "s2" },
//     ],
//     isPossible: true,
//     mismatches: 0,
//   },
//   {
//     store: [
//       { size: 1, quantity: 1 },
//       { size: 2, quantity: 2 },
//       { size: 3, quantity: 1 },
//     ],
//     order: [
//       { id: 100, size: [1] },
//       { id: 101, size: [2] },
//       { id: 102, size: [2, 3], masterSize: "s1" },
//       { id: 103, size: [1, 2], masterSize: "s2" },
//     ],
//     isPossible: true,
//     mismatches: 1,
//   }
// ];

Замыкание, лексическое окружение, рекурсия
Объект лексического окружения можно представить в таком виде:

js
const LE = {
  environmentsRecords: {},
  outer: LE || null,
}
в свойство environmentRecords будут записываться все созданные переменные, то есть работа с переменными это работа с ключами environmentRecords.

LE формируется для скрипта (globalLE), для функции (functionalLE) и для блоков кода. Объект не формирует LE!

На примере ниже показано как изменяется на объект LE:

js
// глобальное лексическое окружение {} -> null
 
let car // {car: undefined} -> null
 
car = 'Toyota' // {car: 'Toyota'} -> null
 
car = 'Ferrari' // {car: 'Ferrari'} -> null
Если же мы создадим функцию то в момент вызова функции в ней будет формироваться ее собственный объект LE в который будут записываться все переменные созданные непосредственно внутри функции

js
//globalLE {} --> null
 
startEngine()
 
let car = 'bmw' //globalLE {car: 'bmw'} --> null
 
const startEngine = function () {
  //startEngineLE {} --> globalLE
  const car = 'kia' // startEngineLE {car: 'kia'} --> globalLE
  console.log(`Start ${car}`)
}
 
startEngine() //globalLE {startEngine: function} --> null
 
car = 'audi' //globalLE {startEngine: function, car: 'audi'} --> null
 
startEngine()
Тоже самое будет происходить с параметрами функции

Давайте рассмотрим пример счетчика и разберем как он работает

js
const counterCreator = () => {
  let count = 0
 
  return () => {
    console.log(count++)
  }
}
 
const counter1 = counterCreator()
// const counter2 = counter();
 
counter1()
counter1()
counter1()
То есть замыкание - это способность функции запомнить в каком лексическом окружении ее создали.

Рекурсия
Перед тем как разбирать как работает рекурсия надо понимать что такое стек. Стек - это структура данных работающая по принципу LIFO. Именно на стеке идет выполнение нашего кода. И так как js однопоточный язык программирования то для выполнения нашего кода выделяется только один стек.

Принцип работы стека:

Когда скрипт вызывает функцию, интерпретатор добавляет её в стек вызовов и потом начинает её обработку.
Любые функции, вызванные этой функцией, добавляются в стек вызовов и выполняются, как только происходит их вызов.
Когда выполнение основной функции завершено, интерпретатор снимает её со стека вызовов и возобновляет выполнение кода в списке основного кода с той точки, где остановился до этого.
Если стек занимает больше места, чем ему было присвоено, это приводит к ошибке переполнения стека ("stack overflow" error).
Пример рекурсии:

js
const pow = (x, n) => {
  if (n === 1) {
    return x
  } else {
    return x * pow(x, n - 1)
  }
}
// 2(4) === 2 * 2(3) === 2 * 2 * 2(2) === 2 * 2 * 2 * 2(1)
 </script> 
 </html>
