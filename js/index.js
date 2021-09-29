console.log(document.querySelector('title').textContent);

/*--------------------------------*/
/* VARIABLES GLOBALES             */
/*--------------------------------*/

let listaProductos = [
{nombre:'Pan',cantidad:2,precio:12.34},
{nombre:'Carne',cantidad:3,precio:34.44},
{nombre:'Leche',cantidad:4,precio:22.64},
{nombre:'Fideos',cantidad:5,precio:42.54}
];

let crearLista = true;
let ul;

/*--------------------------------*/
/*     FUNCIONES GLOBALES         */
/*--------------------------------*/
function borrarProd(index)
{
 
     listaProductos.splice(index,1);
     renderLista();

}

function borrarTodo()
{
    listaProductos.splice(0,listaProductos.length);
    renderLista();
}

function cambiarCantidad(index,el)
{
    let cantidad = Number(el.value);
    listaProductos[index].cantidad = cantidad;
}

function cambiarPrecio(index,el)
{
    let precio = Number(el.value);
    listaProductos[index].precio = precio;
}

function renderLista()
{
    if(crearLista)
    {
        ul = document.createElement('ul');
        ul.classList.add('demo-list-icon','mdl-list','w-100');
    }
  
    ul.innerHTML = '';

    listaProductos.forEach((prod,index) =>{
        ul.innerHTML += `<li class="mdl-list__item">

        <!-- icono del producto -->
        <span class="mdl-list__item-primary-content w-10">
            <i class="material-icons mdl-list__item-icon">shopping_cart</i>
        </span>
    
        <!-- Nombre del producto -->
        <span class="mdl-list__item-primary-content w-30">
           ${prod.nombre}
        </span>
    
        <!-- Entrada de cantidad -->
        <span class="mdl-list__item-primary-content w-20">
    
            <div class="mdl-textfield mdl-js-textfield">
                <input onchange="cambiarCantidad(${index},this)" class="mdl-textfield__input" type="text" id="cantidad-${index}" value=" ${prod.cantidad}">
                <label class="mdl-textfield__label" for="cantidad-${index}">Cantidad</label>
            </div>
        </span>
    
        <!-- Entrada de precio -->
        <span class="mdl-list__item-primary-content w-20 ml-item">
    
            <div class="mdl-textfield mdl-js-textfield">
                <input onchange="cambiarPrecio(${index},this)" class="mdl-textfield__input" type="text" id="precio-${index}" value="${prod.precio}">
                <label class="mdl-textfield__label" for="precio-${index}">Text...</label>
            </div>
        </span>
        <!-- Boton de borrado de producto -->
        <span class="mdl-list__item-primary-content w-20 ml-item">
    
            <button onclick="borrarProd(${index})"
                class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
                <i class="material-icons">remove_shopping_cart</i>
            </button>
        </span>
    </li>`

    });
    if(crearLista)
    {
        document.getElementById('lista').appendChild(ul);
    }
    else
    {
        componentHandler.upgradeElements(ul);
    }
    crearLista = false;
  
};

function configurarListeners()
{
    /* Ingreso de producto */
    document.getElementById('btn-entrada-producto').addEventListener('click',() => {
        let input = document.getElementById('ingreso-producto');
        let producto = input.value;
        
        if(producto)
        {
            listaProductos.unshift({nombre:producto,cantidad:1,precio:0});
            renderLista();
            input.value = null;
        }
    });

    document.getElementById('btn-borrar-productos').addEventListener('click',() => {
         
        if(confirm('confirma borrar todo?'))
        {
            listaProductos = [];
            renderLista();
        }
    });
}

function start(){

    configurarListeners();
    renderLista();
}

start();
