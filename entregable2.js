const fs = require("fs");
const { title } = require("process");

class ProductManager {
    #path=""


    constructor(path){
        this.#path = path;
    }

    async Contador(){
        const products = await this.getProducts()
        let contador = products.length
        if (contador < 0){
            return 0
        }else{
            return contador;
        }
    }

    async getProducts(){
        try{
            const products = await fs.promises.readFile(this.#path, "utf-8");
            return JSON.parse(products);
        }catch (error){
            return [];
        }
    }

    async getProductbyId(id){
        const products = await this.getProducts()
        if(products.find((prod) => prod.id == id)){
            return console.table(products.find((prod)=> prod.id == id))
        }else{
            console.log ("Producto no encontrado")
        }
    }

    async addProduct(title,price,thumbnail,code,stock){
        const products = await this.getProducts()
        const contador = await this.Contador()
        
        const newProduct = {
            id : contador,
            title,
            price,
            thumbnail,
            code,
            stock,
        };
        let repetido = products.find((prod) => prod.code == code);
        if(!title || !price || !thumbnail || !code || !stock){
            console.log("Parametros faltantes")
            }else{
                if (!repetido){
                    await fs.promises.writeFile(this.#path, JSON.stringify([...products, newProduct]));
                    console.log(`El producto ${code} se ha agregado con exito`);
                }else{
                console.log("El producto ya se encuentra en la lista")
        }
    }
}

    async updateProduct(id, propModify){ //se pasa un id y un objeto con las propiedades a modificar
        const products = await this.getProducts(); //obtengo los productos del archivo
        let aux = products.find((prod) => prod.id == id);//busco el producto a modificar
        if (!aux){
            console.log(`El producto con id: ${id} no se encuentra en la base de datos`)
        }else{
            if (Object.keys(propModify).includes(id)){ //chequeo que no se haya pasado el id como variable a modificar ya que no se puede
                console.log("No se puede modificar el id")
            }else{
                aux = {...aux, ...propModify}
                let newArray = products.filter((prod) => prod.id !== id); //obtengo la lista de todos los productos menos el modificado
                newArray = [...newArray, aux] // armo el array de productos con los productos viejos y el nuevo modificado
                await fs.promises.writeFile(this.#path, JSON.stringify(newArray)) //reescribo el archivo
                console.log ("Modificación exitosa")
            }
        }
    }

    async deleteProduct(id){
        const products = await this.getProducts();
        const aux = products.filter((prod) => prod.id !== id);
        await fs.promises.writeFile(this.#path, JSON.stringify(aux)) //reescribo el archivo
                console.log (`Se ha eliminado el producto con el id : ${id}`)
    }
}


///Para eliminar el archivo
async function eliminarArchivo(path){
    await fs.promises.unlink(path)
}


/// Prueba 
async function prueba(){ //title,price,thumbnail,code,stock
    await eliminarArchivo('./products.json')
    const manager1 = new ProductManager('./products.json')
    await manager1.addProduct ("Remera",3000,"img",500,10);
    await manager1.addProduct("Buzo",5000,"img",600,5);
    await manager1.addProduct("Pantalon",5000,"img",700,5);
    await manager1.addProduct("zapatilla",4000,"img",600,2);
    console.table(await manager1.getProducts());
    console.table (await manager1.getProductbyId(0));
    console.table (await manager1.getProductbyId(2));
    await manager1.deleteProduct(2)
    console.table(await manager1.getProducts());
    await manager1.addProduct("Sweater",3000,"img",800,2);
    console.table (await manager1.getProductbyId(2));
    console.table (await manager1.getProductbyId(3));
    console.table(await manager1.getProducts());
    await manager1.updateProduct(2,{title: "Gorra", price: 10400})
    console.table(await manager1.getProducts());
    // await manager1.addProduct("Remera",3000,"img",500,10);
    // await manager1.addProduct("Buzo",20,"img",600,5);
}
prueba()

