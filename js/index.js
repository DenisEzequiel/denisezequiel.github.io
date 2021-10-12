console.log(document.querySelector('title').textContent);

/*--------------------------------*/
/* VARIABLES GLOBALES             */
/*--------------------------------*/

let listaProductos = [
    /*{nombre:'Pan',cantidad:2,precio:12.34},
    {nombre:'Carne',cantidad:3,precio:34.44},
    {nombre:'Leche',cantidad:4,precio:22.64},
    {nombre:'Fideos',cantidad:5,precio:42.54}*/
];

/*--------------------------------*/
/*     LOCAL STORAGE              */
/*--------------------------------*/
function guardarListaProductosLocal(lista)
{
    let prods = JSON.stringify(lista);
    localStorage.setItem('LISTA',prods);
}

function leerListaProductosLocal()
{
    let prods = localStorage.getItem('LISTA');
    if(prods)
    {
        lista = JSON.parse(prods);
    }

    return lista;
}

/*--------------------------------*/
/*     FUNCIONES GLOBALES         */
/*--------------------------------*/



let crearLista = true;
let ul;

/*--------------------------------*/
/*     FUNCIONES GLOBALES         */
/*--------------------------------*/

function borrarTodo() {
    listaProductos.splice(0, listaProductos.length);
    renderLista();
}

async function cambiarCantidad(id, el) {
    let index = listaProductos.findIndex(prod => prod.id == id);
    let cantidad = Number(el.value);
    listaProductos[index].cantidad = cantidad;

    //almacenar la lista en el local storage
    guardarListaProductosLocal(listaProductos);

    let prod = listaProductos[index];
    try {
        await api.putProdWeb(id, prod);
    } catch (err) {
        console.log('cambiarCantidad', err);
    }
}

async function cambiarPrecio(id, el) {
    let index = listaProductos.findIndex(prod => prod.id == id);

    let precio = Number(el.value);
    listaProductos[index].precio = precio;

     //almacenar la lista en el local storage
     guardarListaProductosLocal(listaProductos);
  
    let prod = listaProductos[index];
    try {
        await api.putProdWeb(id, prod);
    } catch (err) {
        console.log('cambiarPrecio', err);
    }
}

async function borrarProd(index) {

    //listaProductos.splice(index, 1);

    try {
        await api.deleteProdWeb(index);
        renderLista();

    } catch (err) {
        console.log('borrarProd', err)
    }

}

async function renderLista() {

    try {
        //leemos la plantilla desde el archivos externo
        let plantilla = await $.ajax({ url: 'plantilla-lista.hbs', method: 'get' });
        const template = Handlebars.compile(plantilla);

        //obtengo lista de productos de la web
        listaProductos = await api.getProdWeb();

        //almacena la lista en el localstorage
        guardarListaProductosLocal(listaProductos);

        $('#lista').html(template({ listaProductos: listaProductos }));

        let ul = $('#contenedor-lista');
        componentHandler.upgradeElements(ul);
    }
    catch (err) {
        console.log('Error en rederLista', err);
    }

}

function configurarListeners() {
    /* Ingreso de producto */
    document.getElementById('btn-entrada-producto').addEventListener('click', async () => {
        let input = document.getElementById('ingreso-producto');
        let producto = input.value;

        if (producto) {
            //listaProductos.unshift({ nombre: producto, cantidad: 1, precio: 0 });
            try {
                let prod = { nombre: producto, cantidad: 1, precio: 0 }
                await api.postProdWeb(prod);
                renderLista();
                input.value = null;
            } catch (err) {
                console.log('entrada producto', err);
            }
        }
    });

    document.getElementById('btn-borrar-productos').addEventListener('click', () => {

        if (listaProductos.length) {
            var dialog = $('dialog')[0];
            dialog.showModal();
        }
    });
}

function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            this.navigator.serviceWorker.register("/sw.js").then(reg => {
                console.log('El service worker se registro correctamente', reg);
            }).catch(err => {
                console.warn('Error al registrar el service worker', err);
            })
        })
    }
    else {
        console.error('serviceWorker no esta disponible en el navegador');
    }
}

function iniDialog() {
    var dialog = $('dialog')[0];
    if (!dialog.showModal) {
        dialog.Polyfill.registerDialog(dialog);
    }

    $('.cancelar').click(() => {
        dialog.close();
    })

    $('.aceptar').click(async () => {
        try {
            await api.deleteAllProdWeb();
            renderLista();
            dialog.close();
        } catch (err) {
            console.log('borrar todo', err);
        }
    });
}

function start() {

    registrarServiceWorker();
    configurarListeners();
    iniDialog();
    renderLista();
}

start();
