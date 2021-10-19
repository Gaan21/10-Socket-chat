const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto, role } = require('../models/index')


const coleccionesPermitidas = [
    'categoria',
    'productos',
    'usuarios',
    'roles'
];

const buscarUsuarios = async ( termino = '', res = response) => {

//Para ver si buscamos por un id de mongo valido o por nombre
    const esMongoId = ObjectId.isValid( termino ); 

    if ( esMongoId ) {
        const usuario = await Usuario.findById( termino );
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
//Si el usuario existe entonces devolvemos arreglo con el usuario y si no un arreglo vacio
        })
    }

//Expresion regular(viene de javscript) para que sea insensible a las mayusc o minusc
    const regex = new RegExp( termino, 'i' )

    const usuarios = await Usuario.find({ 
//Para que busque por nombre o por otras propiedades de Usuario
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
     });

    res.json({
        results: usuarios
    })
}


const buscarCategorias = async ( termino = '', res = response) => {

    //Para ver si buscamos por un id de mongo valido o por nombre
        const esMongoId = ObjectId.isValid( termino ); 
    
        if ( esMongoId ) {
            const categoria = await Categoria.findById( termino );
            return res.json({
                results: ( categoria ) ? [ categoria ] : []
    //Si el usuario existe entonces devolvemos arreglo con el usuario y si no un arreglo vacio
            })
        }
    
    //Expresion regular(viene de javscript) para que sea insensible a las mayusc o minusc
        const regex = new RegExp( termino, 'i' )
    
        const categoria = await Categoria.find({ nombre: regex, estado: true});
    
        res.json({
            results: categoria
        });
    }


    const buscarProductos = async ( termino = '', res = response) => {

        //Para ver si buscamos por un id de mongo valido o por nombre
        const esMongoId = ObjectId.isValid( termino ); 
        
            if ( esMongoId ) {
                const producto = await Producto.findById( termino ).populate('categoria', 'nombre');
                return res.json({
                    results: ( producto ) ? [ producto ] : []
        //Si el usuario existe entonces devolvemos arreglo con el usuario y si no un arreglo vacio
                })
            }
        
        //Expresion regular(viene de javscript) para que sea insensible a las mayusc o minusc
        const regex = new RegExp( termino, 'i' )
        
        const productos = await Producto.find({ nombre: regex, estado: true})
                        .populate('categoria','nombre');//Especifica el nombre de la categoria
        
            res.json({
                results: productos
            });
        }


const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las coleciones permitidas son: ${ coleccionesPermitidas }`
        })
    };

    switch ( coleccion ) {
        case 'usuarios':
            buscarUsuarios( termino, res );
        break;

        case 'categoria':
            buscarCategorias( termino, res );
        break;

        case 'productos':
            buscarProductos( termino, res );
        break;

    
        default:
            res.status(500).json({
                msg: 'No he implementado esta busqueda aun'
            });
    }

   /*  res.json({ //DABA FALLO PORQUE DEVOLVIA DOS COSAS AL RES.JSON
        //EL CASE 'usuarios' Y ESTA RES.JSON
        coleccion, termino
    }) */
}


module.exports = {
    buscar
}