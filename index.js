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

// Замыкание, лексическое окружение, рекурсия
// Объект лексического окружения можно представить в таком виде:

// js
// const LE = {
//   environmentsRecords: {},
//   outer: LE || null,
// }
// в свойство environmentRecords будут записываться все созданные переменные, то есть работа с переменными это работа с ключами environmentRecords.

// LE формируется для скрипта (globalLE), для функции (functionalLE) и для блоков кода. Объект не формирует LE!

// На примере ниже показано как изменяется на объект LE:

// js
// // глобальное лексическое окружение {} -> null
 
// let car // {car: undefined} -> null
 
// car = 'Toyota' // {car: 'Toyota'} -> null
 
// car = 'Ferrari' // {car: 'Ferrari'} -> null
// Если же мы создадим функцию то в момент вызова функции в ней будет формироваться ее собственный объект LE в который будут записываться все переменные созданные непосредственно внутри функции

// js
// //globalLE {} --> null
 
// startEngine()
 
// let car = 'bmw' //globalLE {car: 'bmw'} --> null
 
// const startEngine = function () {
//   //startEngineLE {} --> globalLE
//   const car = 'kia' // startEngineLE {car: 'kia'} --> globalLE
//   console.log(`Start ${car}`)
// }
 
// startEngine() //globalLE {startEngine: function} --> null
 
// car = 'audi' //globalLE {startEngine: function, car: 'audi'} --> null
 
// startEngine()
// Тоже самое будет происходить с параметрами функции

// Давайте рассмотрим пример счетчика и разберем как он работает

// js
// const counterCreator = () => {
//   let count = 0
 
//   return () => {
//     console.log(count++)
//   }
// }
 
// const counter1 = counterCreator()
// // const counter2 = counter();
 
// counter1()
// counter1()
// counter1()
// То есть замыкание - это способность функции запомнить в каком лексическом окружении ее создали.

// Рекурсия
// Перед тем как разбирать как работает рекурсия надо понимать что такое стек. Стек - это структура данных работающая по принципу LIFO. Именно на стеке идет выполнение нашего кода. И так как js однопоточный язык программирования то для выполнения нашего кода выделяется только один стек.

// Принцип работы стека:

// Когда скрипт вызывает функцию, интерпретатор добавляет её в стек вызовов и потом начинает её обработку.
// Любые функции, вызванные этой функцией, добавляются в стек вызовов и выполняются, как только происходит их вызов.
// Когда выполнение основной функции завершено, интерпретатор снимает её со стека вызовов и возобновляет выполнение кода в списке основного кода с той точки, где остановился до этого.
// Если стек занимает больше места, чем ему было присвоено, это приводит к ошибке переполнения стека ("stack overflow" error).
// Пример рекурсии:

// js
// const pow = (x, n) => {
//   if (n === 1) {
//     return x
//   } else {
//     return x * pow(x, n - 1)
//   }
// }
// // 2(4) === 2 * 2(3) === 2 * 2 * 2(2) === 2 * 2 * 2 * 2(1)
//  </script> 
//  </html>

let pr = new Promise((resolve, reject)=>{
  setTimeout(()=>{resolve()},
   3000)
  
})
console.log(pr)
Promise, async/await, static methods
Начнем с того что давайте подумаем, как будут выполняться эти три запроса

js
fetch('https://yahoo.com/?query=js')
console.log(yahooData)
fetch('https://bing.com/?query=js')
console.log(bingData)
fetch('https://google.com/?query=js')
console.log(googleData)
Что нужно сделать чтобы они выполнялись последовательно? Из метода .then() возвращать новый запрос:

js
fetch('https://yahoo.com/?query=js')
  .then(yahooData => {
    console.log(yahooData)
    return fetch('https://bing.com/?query=js')
  })
  .then(bingData => {
    console.log(bingData)
    return fetch('https://google.com/?query=js')
  })
  .then(googleData => {
    console.log(googleData)
  })
В 2017 году в js появились асинхронные функции и давайте посмотрим как новый функционал можно использовать в нашем примере:

js
const run = async () => {
  const yahooData = await fetch('https://yahoo.com/?query=js')
  console.log(yahooData)
  const bingData = await fetch('https://bing.com/?query=js')
  console.log(bingData)
  const googleData = await fetch('https://google.com/?query=js')
  console.log(googleData)
}
 
run()
Как видно из кода выше, код стал еще короче и лаконичнее, теперь мы пишим, как будто, синхронный код, при этом движок будет останавливать там где нужно подождать ответа от сервера и после получения такого ответа - продолжать выполнение асинхронной функции.

Если нам надо обработать ошибки, то весь асинхронный код мы должны поместить в блок try, а обработку ошибок осуществлять в блоке catch:

js
const run = async () => {
  try {
    const yahooData = await fetch('https://yahoo.com/?query=js')
    console.log(yahooData)
    const bingData = await fetch('https://bing.com/?query=js')
    console.log(bingData)
    const googleData = await fetch('https://google.com/?query=js')
    console.log(googleData)
  } catch (error) {
    console.log(error)
  }
}
 
run()
Также в асинхронной функции есть блок finally который работает точно так же как метод .finally() в промисах.

Асинхронная функция, после своего выполнения возвращает новый промис.

Теперь разберем статические методы класса Promise и начнем с методы all().

Метод all() принимает массив промисов и возвращает новый промис. Новый промис завершится, когда завершится весь переданный список промисов, и его результатом будет массив их результатов, причем порядок элементов массива в точности соответствует порядку исходных промисов. Если любой из промисов завершится с ошибкой, то промис, возвращённый Promise.all, немедленно завершается с этой ошибкой.
js
const bigPromise = Promise.all([
  fetch('https://google.com/?query=js'),
  fetch('https://yahoo.com/?query=js'),
  fetch('https://bing.com/?query=js'),
])
 
bigPromise
  .then(data => {
    console.log(data)
  })
  .catch(err => {
    console.log('CATCH ERROR', err.message)
  })
Метод race() ждёт только первый выполненный промис, из которого берёт результат (или ошибку), после этого все остальные промисы игнорируются.
js
const bigPromise = Promise.race([
  fetch('https://google.com/?query=js'),
  fetch('https://yahoo.com/?query=js'),
  fetch('https://bing.com/?query=js'),
])
 
bigPromise
  .then(data => {
    console.log(data.url)
  })
  .catch(err => {
    console.log(err)
  })
Метод any() очень похож на Promise.race, но ждёт только первый успешно выполненный промис, из которого берёт результат. Если ни один из переданных промисов не завершится успешно, тогда возвращённый объект Promise будет отклонён с помощью AggregateError – специального объекта ошибок, который хранит все ошибки промисов в своём свойстве errors.
js
const bigPromise = Promise.any([
  fetch('https://google.com/?query=js'),
  fetch('https://yahoo.com/?query=js'),
  fetch('https://bing.com/?query=js'),
])
 
bigPromise
  .then(data => {
    console.log(data.url)
  })
  .catch(err => {
    console.log(err)
  })
Метод allSettled() не похож на все остальные методы, которые мы рассмотрели выше тем, что промис, который возвращает даный метод никогда не зареджектится, а соответственно никогда не отработает catch(). У данного метода всегда будет отрабатывать метод .then() с таким массивом елементов:
{status:"fulfilled", value:результат} для успешных завершений,
{status:"rejected", reason:ошибка} для ошибок.
js
const bigPromise = Promise.allSettled([
  fetch('https://googlesdf.com/?query=js'),
  fetch('https://yahoodsf.com/?query=js'),
  fetch('https://bingsad.com/?query=js'),
])
 
bigPromise.then(data => {
  console.log('then', data)
})
