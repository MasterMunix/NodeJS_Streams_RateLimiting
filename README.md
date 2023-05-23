# NodeJS_Streams_RateLimiting
Knowing how to process high data from this video https://www.youtube.com/watch?v=tNjmQxwD1TM . Thanks to Erick Wendel for this tutorial, really appreciated. 

These projects consists in two apps, the data-integration works as follows:

1. You run the following command to create the file in a git bash or in linux machine:
```
echo "id,name,desc,age" > big.csv 
for i in `seq 1 5`; do node.exe -e "process.stdout.write('$i,erick-$i,$i-text,$i\n'.repeat(1e5))" >> big.csv; done
```
This creates the csv file to read. 
2. Then you run the command ```npm start``` and its going to send the data from the CSV file to the server (webapi App) and you can limit the request per second in the [.env file](data-integration/src/.env.example) of the data-integration App. 
3. And that's it. 

Now let's go with the webapi App:
1. For this one run ```npm run start``` in the console. 
2. For this one you can limit the max of requests per second that the API can accept. You can do this in the [env file of the project](webapi/.env.example)
and change the variable ```MAX_LIMIT```.
3. Then the api creates the file output.ndjson with the data sent. 
