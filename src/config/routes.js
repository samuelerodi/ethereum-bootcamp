//CONTAINERS
import App from '../App';
import Home from '../containers/Home';
import About from '../containers/About';
import Stats from '../containers/Stats';
// import NotFound from '../containers/NotFound';


export default [
  {
    component: App,
    childRoutes: [

        { path: '/about', component: About },
        { path: '/stats', component: Stats },
    //     {
    //         path: '/posts',
    //         component: Posts,
    //         childRoutes: [ { path: '/post/:nr', component: Post } ]
    //     },
    ]
  },
  { path: '*', component: Home }

];
