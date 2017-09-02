import { expect, assert } from 'chai';
import { IndexService } from "./index.service";

const mockIndexModule = "dist/indexer/index.mock";

describe("index.service", () => {

  it("schedule task", (done: (err?: any) => void) => {
    let indexService = new IndexService(mockIndexModule);
    indexService.startIndexing({ name: "test1" }).then(projectTree => {
      try{
        assert.isDefined(projectTree.getProject("test1"));
        done();
      }catch(e){
        done(e);
      }
    }).catch(e => done(e));
  });

  it("queue task", (done: (err?: any) => void) => {
    let indexService = new IndexService(mockIndexModule);
    let env = {name: "test2"};
    let task1 = indexService.startIndexing(env);
    let task2 = indexService.startIndexing(env);
    let task3 = indexService.startIndexing(env);
    Promise.all([task1, task2, task3]).then(results => {

    }).catch(e => done(e));
    indexService.startIndexing({ name: "test1" }).then(projectTree => {
      try{
        assert.isDefined(projectTree.getProject("test1"));
        done();
      }catch(e){
        done(e);
      }
    }).catch(e => done(e));
  });

});

it("test", (done: (err?: any) => void) => {
  let promise = Promise.resolve("done");
  Promise.all([promise, promise]).then((result: any[]) => {
    try {
      assert.deepEqual(result, ["done", "done"]);
      done();
    } catch (e) {
      done(e);
    }
  }).catch(e => done(e));
});