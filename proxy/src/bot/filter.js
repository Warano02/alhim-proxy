/**
 * 
 * @param {string} text 
 * @returns {isDanger:boolean,danger:string}
 */
async function Filter(text) {
    /**
     * analyse le prompt et renvoie un json pour voir le risque d'injection 
     * la reponse doit etre sous la forme {isDanger:boolean,danger:string}
     */
    return {isDanger:true,danger:"Injection SQL"}
}


module.exports = Filter