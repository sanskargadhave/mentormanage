function CreateTestId(req,resp,next)
{
    const {subject,year,division,date}=req.body;
    const tempdate=new Date(date);
    const dd = String(tempdate.getDate()).padStart(2, "0");
    const mm = String(tempdate.getMonth() + 1).padStart(2, "0");
    const yyyy = tempdate.getFullYear();
    const testid=`TS-${dd}${mm}${yyyy}-${subject}-${year.toUpperCase()}-${division}`;
    req.body.testid=testid;
    next();
}
module.exports=CreateTestId;