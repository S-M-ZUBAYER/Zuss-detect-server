const express=require("express");
const cors=require("cors");
require("dotenv").config();
const port=process.env.PORT || 5000;


const app=express();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("I am running as the server site of ZUSS Detect")
})

const {Configuration, OpenaAIApi, OpenAIApi}= require ("openai");
const configuration=new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration)

app.post("/detect",(req,res)=>{
    const  question =req.body.question;
const address= `${question} +" "+ 请告诉哪个是公司名字，公司税号，公司地址，公司电话，公司开户行，公司账号，哪个是备注`

openai.createCompletion({
        model: "text-davinci-003",
        prompt: address,
        max_tokens: 1000,
        temperature: 0,
    }).then((response)=>{
        console.log(response?.choices?.[0]?.text);
        return response?.data?.choices?.[0]?.text;
    })
    .then((answer)=>{
        console.log({answer});
        const array=answer?.split("\n").filter((value)=>value).map((value)=>value.trim());
        return array;
    })
    .then((answer)=>{
        res.json({
            answer: answer,
            prompt: question
        })
    })
})


app.listen(port,()=>{
    console.log(`Listening to the ${port}`)
})