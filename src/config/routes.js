//CONTAINERS
import App from '../App';
import Home from '../containers/Home';
import About from '../containers/About';
import Statistics from '../containers/Statistics';
import MarketPlace from '../containers/MarketPlace';
import MyAlbum from '../containers/MyAlbum';
import Admin from '../containers/Admin';
// import NotFound from '../containers/NotFound';


export default [
  {
    component: App,
    childRoutes: [

        { path: '/about', component: About },
        { path: '/stats', component: Statistics },
        { path: '/market', component: MarketPlace },
        { path: '/album', component: MyAlbum },
        { path: '/admin', component: Admin },
    //     {
    //         path: '/posts',
    //         component: Posts,
    //         childRoutes: [ { path: '/post/:nr', component: Post } ]
    //     },
    ]
  },
  { path: '*', component: Home }

];
