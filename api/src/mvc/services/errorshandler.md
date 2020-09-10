## Use Async-Await or promises for async error handling

Callbacks don’t scale well since most programmers are not familiar with them. They force to check errors all over, deal with nasty code nesting and make it difficult to reason about the code flow. Promise libraries like BlueBird, async, and Q pack a standard code style using RETURN and THROW to control the program flow. Specifically, they support the favorite try-catch error handling style which allows freeing the main code path from dealing with errors in every function

### Code Example – using promises to catch errors
```
return functionA()
  .then((valueA) => functionB(valueA))
  .then((valueB) => functionC(valueB))
  .then((valueC) => functionD(valueC))
  .catch((err) => logger.error(err))
  .then(alwaysExecuteThisFunction())
```

### Code Example - using async/await to catch errors

```
async function executeAsyncTask () {
  try {
    const valueA = await functionA();
    const valueB = await functionB(valueA);
    const valueC = await functionC(valueB);
    return await functionD(valueC);
  }
  catch(err) {
    logger.error(err);
  } finally {
    await alwaysExecuteThisFunction();
  }
}
```