const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){ //declare an asynchronous function
    const itemText = this.parentMode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span
    try { // starting a try block to do something
        const response = await fetch('deleteItem', { //create a response variable that waits on a fetch to get data from the result of the delete route
            method: 'delete',  //setting the CRUD method to 'delete' for the route
            headers: {'Content-Type': 'application/json'}, //specify the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the  list item, and naming it 'itemFromJS'
            }) //close the body
        }) // Closing the object
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    } catch (error) { //If an error occurs, pass the error into the catch block
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markComplete(){
    const itemText = this.parentMode.childNodes[1].innerText
    try {
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()

    } catch (error) {
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentMode.childNodes[1].innerText
    try {
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()

    } catch (error) {
        console.log(err)
    }
}