const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto} = require('../models');



const cargarArchivo = async ( req, res = response) => {
    
      try { //Si el reject de la promesa en subirArchivo devuelve el reject
// no devolvera nada el await y reventara la aplicacion
        
      //Las extensiones permitidas son imagenes
      const pathImagen = await subirArchivo( req.files, undefined, 'imgs' );
      //Da error si no se comenta

      //Para subir txt, md
      //const pathTxt = await subirArchivo(req.files, ['txt', 'md'], 'textos');

      res.json({
          nombre: pathImagen
      })

      } catch (msg) {
          res.status(400).json({ msg });
      }   
}


    const actualizarImagen = async ( req, res = response ) => { 

        const { coleccion, id } = req.params;

        let modelo;

        switch (coleccion) {

            case 'usuarios':  
                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${id}`
                    });
                }           
                break;
        
            case 'productos':
                modelo = await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    });
                }   
                break;

            default:
                return res.status(500).json({
                    msg: 'Funcion no implementada'
                })
        }


        //Limpiar imagenes previas
        if (modelo.img) {
            //Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            
            if ( fs.existsSync( pathImagen)){
                fs.unlinkSync( pathImagen ); //Para borrar la imagen en el path
            }
        }


        const nombre = await subirArchivo( req.files, undefined, coleccion);
//Las imagenes que recibimos, el array de extensiones y la carpeta donde se mete(usuarios o productos)
        modelo.img = nombre;

        await modelo.save();

        res.json({ modelo})
    }


    const actualizarImagenCloudinary = async ( req, res = response ) => { 

        const { coleccion, id } = req.params;

        let modelo;

        switch (coleccion) {

            case 'usuarios':  
                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${id}`
                    });
                }           
                break;
        
            case 'productos':
                modelo = await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    });
                }   
                break;

            default:
                return res.status(500).json({
                    msg: 'Funcion no implementada'
                })
        }


        //Limpiar imagenes previas
        if (modelo.img) {
            const rutaCompleta = modelo.img.split('/');
            const nombreArchivo = rutaCompleta [ rutaCompleta.length -1];
            const [ public_id ] = nombreArchivo.split('.'); //Te devuelve la 1ª parte del arreglo

            cloudinary.uploader.destroy( public_id );
        }

        const { tempFilePath } = req.files.archivo //Extraemos la propiedad temp.. de archivo

        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        //Se extrae la url de lo que viene en la respuesta de lo que subimos a cloudinary

        modelo.img = secure_url; //Guardamos en la propiedad img del modelo la url de cloudinary

        await modelo.save();

        res.json({ modelo })
    }


    const mostrarImagen = async ( req, res = response ) => {

        const { coleccion, id } = req.params;

        let modelo;

        switch (coleccion) {

            case 'usuarios':  
                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${id}`
                    });
                }           
                break;
        
            case 'productos':
                modelo = await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    });
                }   
                break;

            default:
                return res.status(500).json({
                    msg: 'Funcion no implementada'
                })
        }


        //Devolver la imagen que ya existe
        if (modelo.img) {
            
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            
            if ( fs.existsSync( pathImagen)){
                return res.sendFile( pathImagen )
            }
        }

        //Devolver path con imagen de muestra de assets
        const pathMuestra = path.join(__dirname, '../assets/no-image.jpg');
        res.sendFile( pathMuestra );
    }


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}