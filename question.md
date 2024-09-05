1. What is the difference between Component and PureComponent?
Give an example where it might break my app.
    -   

2. Context + ShouldComponentUpdate might be dangerous. Why is
that?


3. Describe 3 ways to pass information from a component to its
PARENT.
    -   a) We can pass callback functions to the children which will send back the necessary info to the parent using that function
        b) We can set up a context using useContext wrap the module in a context.provider. All the elements inside this context will have the access to updated values. So if a child updates something the parent naturally will have its value.
        c) Using a global state management tool like redux. Similar to context this global state can be updated and subscribed from anywhere in the application. Hence any data changes in the child will be visible in the parent component.

4. Give 2 ways to prevent components from re-rendering.
    -   a) Export the component as a memoised entity. And use callbacks to check for any prop updates. This will ensure that the component doesn't render unless any props are changed.


5. What is a fragment and why do we need it? Give an example where it
might break my app.
    -   Fragment is a fundamental unit in react which can help us wrapping multiple elements in one bundle. It is beneficial when any callback is 

6. Give 3 examples of the HOC pattern.


7. What's the difference in handling exceptions in promises,
callbacks and async...await?


8. How many arguments does setState take and why is it async.


9. List the steps needed to migrate a Class to Function
Component.


10.List a few ways styles can be used with components.


11. How to render an HTML string coming from the server.
