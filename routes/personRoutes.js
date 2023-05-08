const router = require('express').Router()
const { status } = require('express/lib/response')
const Person = require('../models/Person')


//1° ROTA: POST (criar dado)
router.post('/', async(req, res) => {

    const{ name, salary, approved } = req.body

    if(!name) {
        res.status(422).json({error: 'O nome é obrigatório'})
        return
    }

    const person = {
        name,
        salary,
        approved
    }

    //metodo create, try/catch para prever possiveis erros
    try {

        await Person.create(person)//criando dados
        res.status(201).json({message: 'Pessoa inserida no sistema com sucesso!'})

    } catch (err){
        res.status(500).json({error: error})
    }

})

//2° ROTA: READ (buscar dados)
router.get('/', async(req, res) => {
    try {

        const people = await Person.find()
        res.status(200).json(people)

    } catch(error) {
        res.status(500).json({error: error})
    }
})

//3° ROTA: GET BY ID (buscar dados pelo id)
router.get('/:id', async(req, res) => {

    const id = req.params.id
    
    try{
        const person = await Person.findOne({_id: id})

        if(!person) {
            res.status(422).json({message: 'Usuário não encontrado'})
            return
        }

        res.status(200).json(person)
    } catch(error) {
        res.status(500).json({error: error})
    }
})

//4° ROTA: PUT/PATCH - UPDATE (atualização dos dados)
//PUT: atualização total dos dados
//PATCH: atualização parcial dos dados
router.patch('/:id', async (req, res) => {

    const id = req.params.id
    const { name, salary, approved } = req.body
    const person = {
        name, 
        salary,
        approved,
    }

    try {
        const updatePerson = await Person.updateOne({_id: id}, person)

        if(updatePerson.matchedCount === 0) {
            res.status(422).json({message: 'O usuário não foi encontrado'})
            return
        }

        res.status(200).json(person)

    } catch(error) {
        res.status(500).json({error: error})
    }
})

//5° ROTA: DELETE(deletar dados)
router.delete('/:id', async(req, res) => {

    const id = req.params.id
    const person = await Person.findOne({_id: id})

    if(!person) {
        res.status(422).json({message: 'O usuário não foi encontrado'})
        return
    }

    try{

        await Person.deleteOne({_id: id})
        res.status(200).json({message: 'Usuário removido com sucesso!'})

    } catch (error) {
        res.status(500).json({error: error})
    }


})


module.exports = router