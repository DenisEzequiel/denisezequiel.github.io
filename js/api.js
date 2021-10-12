const api = (function(){

function getUrl(id) {
    return 'https://615db2e112571a0017207822.mockapi.io/products' + (id ? ('/' + id) : '');
}

async function getProdWeb() {
    try {
        let url = getUrl() + '?' + Date.now();
        let prods = await $.ajax({ url, method: 'get' });
        return prods;
    } catch (error) {
        console.log(error);
    }
}

async function deleteProdWeb(id) {
    try {
        let url = getUrl(id);
        return await $.ajax({ url, method: 'delete' });
    }
    catch (err) {
        console.log('Error putProdWeb', err);
    }
}

async function postProdWeb(prod) {
    try {
        let url = getUrl();
        return await $.ajax({ url, method: 'post', data: prod });

    } catch (err) {
        console.log('Error postProdWeb', err);
    }
}

async function putProdWeb(id, prod) {
    try {
        let url = getUrl(id);
        return await $.ajax({ url, method: 'put', data: prod });
    } catch (err) {
        console.log('Error putProdWeb', err);
    }
}

const retardo = ms => new Promise(resolve => setTimeout(resolve, ms));

async function deleteAllProdWeb() {

    let progress = document.querySelector('progress');
    let porcentaje = 0;
    let btnBorrarProductos = document.querySelector('#btn-borrar-productos');

    progress.value= 0;
    progress.style.display = 'block';
    btnBorrarProductos.setAttribute('disabled',true);

    for (let i = 0; i < listaProductos.length; i++) {
        porcentaje = Math.ceil((i * 100) / listaProductos.length);
        console.log(porcentaje + '%');
        progress.value = porcentaje;

        let id = listaProductos[i].id;
        try {
           
            let url = getUrl(id);
            await retardo(300);
            await $.ajax({ url, method: 'delete' });
        } catch (error) {
            console.log('Error deleteAllProdWeb', error);
        }
    }

    porcentaje = 100;
    console.log(porcentaje + '%');
    progress.value = porcentaje;


    setTimeout(() => {
        progress.style.display = 'none'; 
        btnBorrarProductos.removeAttribute('disabled');

    }, 2000);
    
}

return {
    getProdWeb,
deleteProdWeb,
 
postProdWeb,
putProdWeb,
deleteAllProdWeb 
}
})();