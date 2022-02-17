// Loading screen function

$(window).on('load', function(){
    $(".loader").fadeOut(1000);
    $(".content").fadeIn(1000);
});


document.addEventListener("DOMContentLoaded", () => {
    fetchData()
})

const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        // console.log(data)
        paintProducts(data)
        detectButtons(data)
    } catch (error) {
        console.log(error)
    }
}

const productsContainer = document.querySelector('#productsContainer')
const paintProducts = (data) => {
    const template = document.querySelector('#productsTemplate').content
    const fragment = document.createDocumentFragment()
    
    data.forEach(product => {
        
        template.querySelector('img').setAttribute('src', product.thumbnailUrl)
        template.querySelector('h5').textContent = product.title
        template.querySelector('p span').textContent = product.precio
        template.querySelector('button').dataset.id = product.id
        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })
    productsContainer.appendChild(fragment)
}

let shoppingCart = {}

const detectButtons = (data) => {
    const buttons = document.querySelectorAll('.card button')

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            
            const product = data.find(item => item.id === parseInt(btn.dataset.id))
            product.quantity = 1
            if (shoppingCart.hasOwnProperty(product.id)) {
                product.quantity = shoppingCart[product.id].quantity + 1
            }
            shoppingCart[product.id] = { ...product }
            
            cartFunction()
        })
    })
}

const items = document.querySelector('#items')


// Function to make the shopping cart work
const cartFunction = () => {

    //pendiente innerHTML
    items.innerHTML = ''

    const template = document.querySelector('#template-carrito').content
    const fragment = document.createDocumentFragment()

    Object.values(shoppingCart).forEach(product => {
        // console.log('producto', producto)
        template.querySelector('th').textContent = product.id
        template.querySelectorAll('td')[0].textContent = product.title
        template.querySelectorAll('td')[1].textContent = product.quantity
        template.querySelector('span').textContent = product.precio * product.quantity
        
        //buttons
        template.querySelector('.btn-info').dataset.id = product.id
        template.querySelector('.btn-danger').dataset.id = product.id

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    paintFooter()
    buttonsAction()

}

const footer = document.querySelector('#footer-carrito')
const paintFooter = () => {

    footer.innerHTML = ''

    // This function will hide empty and buy buttons 

    if (Object.keys(shoppingCart).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Empty shopping cart - Select a game to buy!</th>
        `
        return
    }

    const template = document.querySelector('#template-footer').content
    const fragment = document.createDocumentFragment()

    // Add up quantities & total
    const nQuantity = Object.values(shoppingCart).reduce((acc, { quantity }) => acc + quantity, 0)
    const nPrice = Object.values(shoppingCart).reduce((acc, {quantity, precio}) => acc + quantity * precio ,0)
    // console.log(nPrecio)
    

    template.querySelectorAll('td')[0].textContent = nQuantity
    template.querySelector('span').textContent = nPrice

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)


    const button = document.querySelector('#vaciar-carrito')
    button.addEventListener('click', () => {
        shoppingCart = {}
        cartFunction()
    })

    const checkOutButton = document.querySelector('#comprar-carrito')
    checkOutButton.addEventListener('click', () => {
        shoppingCart = {}
        swal("Good job!", "Purchase made succesfully!", "success");
        cartFunction()  
    }) 
}

const buttonsAction = () => {
    const addUpButton = document.querySelectorAll('#items .btn-info')
    const deleteButton = document.querySelectorAll('#items .btn-danger')

    // "+" button 

    addUpButton.forEach(btn => {
        btn.addEventListener('click', () => {
            // console.log(btn.dataset.id)
            const product = shoppingCart[btn.dataset.id]
            product.quantity ++
            shoppingCart[btn.dataset.id] = { ...product }
            cartFunction()
        })
    })

    // "-" button

    deleteButton.forEach(btn => {
        btn.addEventListener('click', () => {
            const product = shoppingCart[btn.dataset.id]
            product.quantity--
            if (product.quantity === 0) {
                delete shoppingCart[btn.dataset.id]
            } else {
                shoppingCart[btn.dataset.id] = { ...product }
            }
            cartFunction()
        })
    })
}