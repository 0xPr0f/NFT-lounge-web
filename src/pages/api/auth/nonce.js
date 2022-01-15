 //import supabase from '../../../functions/supabase'
 import { v4 as uuidv4} from "uuid"
 

  //POST /api/auth/nonce
 
 const nonceApi = async (req, res) => {

    //pass public address to database
    //check if address is in database
    //do not create new record for return users because they may have relations
    const {walletAddr} = req.body
    const nonce = uuidv4()

    let {data, error} = await supabase
    .from('users')
    .select('nonce')
    .eq('walletAddr', walletAddr)
    //check if the user that wants to put sig on nonce exists 
    
    //when querying, supabase assumes they can return array of records
    // //retrive only one row with single
    // .single()
    console.log(`error`, error)

    console.log(`data`, data)

    if(data.length > 0) {
        //new nonce
        console.log(`user exists`)
    } else {
        console.log(`create user`)
        let {data, error}=await supabase.from('users').insert({nonce, walletAddr})
    }

    console.log(`data`, data)

    if(error) {
        res.status(400).json({error: error.message})
    } else {
        res.status(200).json({nonce})
    }
}
export default nonceApi;