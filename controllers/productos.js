const { response } = require("express");
const { Producto } = require('../models/index')


//Obtener Productos - paginado - total - populate
const obtenerProductos = async ( req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const status = { estado: true};

    const [ total, productos ] = await Promise.all([ //Coleccion de promesas
        Producto.countDocuments(status),   //total es resultado de la 1º promesa
        Producto.find(status)              //Productos es resultado de la 2º promesa
            .populate('usuario','nombre')  //Para ver el usuario que hace la peticion
            .populate('categoria','nombre')
            .skip( Number (desde))
            .limit( Number (limite))
    ]);


    res.json({
        total,
        productos
    });
    
    //Mi forma de hacerlo
   /*  const totalProductosBD = await Producto.countDocuments();

    const status = { estado: true };

    const todasProductos = await Producto.find(status);

    res.json({
        totalProductosBD,
        todasProductos
    }); */
}


//Obtener Producto - populate {Regresa el objeto de la Producto}
const obtenerProducto = async (req, res = response) =>{

    const { id } = req.params;
    const producto = await Producto.findById( id )
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(producto);
}


//Crear Producto
const crearProducto = async ( req, res = response) => {
//Grabamos el nombre que viene en el body de la peticion de crear Producto en mayusculas
    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre }); 

    if (productoDB) {
        return res.status(400).json({
            msg: `El Producto ${productoDB.nombre} ya esta creado`
        });
    }

    //Generar la data que se va a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    //El id de mongo del usuario que esta haciendo la peticion para crear la Producto 
    }

    const producto = new Producto(data);

    //Guardar en DB
    await producto.save();

    res.status(201).json(producto);
}


//Actualizar Producto
const actualizarProducto = async ( req,res = response) => {
//Sabemos que tiene que venir un id
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    //Para que no puedan cambiar al enviar ni el estado ni el usuario

//El nombre viene en la data y cambia, pero puede ser una const porque la data no cambia(cambia la propiedad nombre de su interior)
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id; //El usuario que realiza la peticion de actualizar

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    //Actualizamos el id que nos viene en la req y le introducimos la data actualizada
    //new: true Para que los cambios aparezcan al hacer la peticion

    res.json( producto );
}


//Borrar Producto
const borrarProducto = async ( req, res = response ) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false}, { new: true});

    res.json( productoBorrado );
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}