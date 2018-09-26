# Homework-Assignment-1
A RESTful JSON API that listens on the port of your choice with route to /hello returning a welcome message in JSON Format

# Edit
There has a change in my project. You can put names in the url or in the headers using the postman app.

# Running the tests
* If using headers, put these in your header tab
```
name  : Jayson
```


* If using query string, type this in the url
```
localhost:3000/hello?name=Jayson
```

The handlers holds the name from the headers or query strings; prioritizing the value of query strings then the value from the headers. So if there are two names, both from the headers and url, it will get the name from the query string instead.
