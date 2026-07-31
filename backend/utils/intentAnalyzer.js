function detectIntent(message){
    message=message.toLowerCase();
    if(message.includes("attendance")) return "attendance";
    if(message.includes("leave")) return "leave";
    if(message.includes("assignment")) return "assignment";
    if(message.includes("test")) return "test";
    if(message.includes("report")) return "report";
    if(message.includes("student")) return "student";
    return "general";
}
function extractRollno(message){
    
    const match = message.match(/\b\d+\b/);

    return match ? Number(match[0]) : null;
}
function extractName(message){
    const words=message.split(" ");
    const stopWords=[
        "show","attendance","of","for","student","roll","no","report","leave"
    ];
    const name=words.filter(word=>!stopWords.includes(word)).join(" ");
    return name;
}

module.exports={detectIntent};