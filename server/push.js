const fs = require('fs');
const urlsafeBase64 = require('urlsafe-base64');

const vpublic_key = process.env.VPUBLIC_KEY;
const vprivate_key = process.env.VPRIVATE_KEY;
const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:jesusfrancisco@braincoding.co',
    vpublic_key,
    vprivate_key
);

let suscripciones = require('./subs-db.json');

module.exports.getKey = ()=>{
    return urlsafeBase64.decode(vpublic_key)
}
module.exports.addSubscription = (suscription)=>{
    suscripciones.push(suscription);
    fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(suscripciones))
}


module.exports.sendPush = (post) => {

    const notificacionesEnviadas = [];

    suscripciones.forEach((suscripcion,i) =>{

        const pushProm = webpush.sendNotification(suscripcion, JSON.stringify(post))
        .then(console.log('notificacion enviada'))
        .catch(err => {
            if(err.statusCode === 410){
                suscripciones[i].borrar = true;
            }
        })

        notificacionesEnviadas.push(pushProm)

    })

    Promise.all(notificacionesEnviadas).then(()=>{
        suscripciones = suscripciones.filter(subs => !subs.borrar)
        fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(suscripciones))
    })
}