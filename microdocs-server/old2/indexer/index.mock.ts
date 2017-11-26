
process.on("message", (input: {taskName:string, data:any}) => {
  try {
    if (input && input.taskName && input.data && input.taskName === "reindex"){
      switch (input.data.toLowerCase()){
        case "test1": test1(); break;
        default:
          throw new Error("Invalid input data: " + input.data);
      }
    } else {
      throw new Error("Invalid input: " + JSON.stringify(input));
    }
  } catch (e) {
    process.send({ error: e });
    process.exit(1);
  }
});

function test1(){
  process.send({ test1: {} });
  process.exit(0);
}
