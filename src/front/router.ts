import { Router } from '@vaadin/router';

const router = new Router(document.querySelector('.root'));
router.setRoutes([
  {path: '/', component: 'home-page'},
  {path: '/signup', component: 'ing-nombre'},
  {path: '/auth', component: 'ing-sala'},
  {path: '/err', component: 'ing-error'},
  {path: '/instructions', component: 'instructions-page'},
  {path: '/waitplayer', component: 'waiting-room' },
  {path: '/play', component: 'play-page'},
  {path: '/win', component: 'win-page'},
  {path: '/lose', component: 'lose-page'},
  {path: '/draw', component: 'draw-page'}
]);