import Vue from 'vue';
import Router from 'vue-router';

import Home from '#/Home';
import Login from '#/Login';
import Register from '#/Register';
import Remove from '#/Remove';

import ContinuousActivitys from 'CONTINUOUS/ContinuousActivitys';
import AddContinuousActivity from 'CONTINUOUS/AddContinuousActivity';
import EditContinuousActivity from 'CONTINUOUS/EditContinuousActivity';

import Projects from 'PROJECTS/Projects';
import AddProject from 'PROJECTS/AddProject'
import EditProject from 'PROJECTS/EditProject';

import Sprints from 'SPRINTS/Sprints';
import AddSprint from 'SPRINTS/AddSprint';
import EditSprint from 'SPRINTS/EditSprint';

import Tasks from 'TASKS/Tasks';
import AddTask from 'TASKS/AddTask';
import EditTask from 'TASKS/EditTask';

import store from '@/core';

Vue.use(Router)

const auth = store.state.auth;

function requireAuth (to, from, next) {
  if (auth.token == null || auth.token == '') {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter: requireAuth
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    { path: '/logout',
        beforeEnter (to, from, next) {
          auth.logout()
          next('/login')
        }
    },
    {
      path: '/remove',
      name: 'Remove',
      component: Remove,
      beforeEnter: requireAuth
    },
    {
	    path: '/continuous_activitys',
      name: ContinuousActivitys,
	    component: ContinuousActivitys,
      beforeEnter: requireAuth
    },
    {
      path: '/edit_continuous_activity/:id/',
      name: 'EditContinuousActivity',
      component: EditContinuousActivity,
      beforeEnter: requireAuth
    },
    {
      path: '/add_continuous_activity',
      name: 'AddContinuousActivity',
      component: AddContinuousActivity,
      beforeEnter: requireAuth
    },
    {
      path: '/projects',
      name: 'Projects',
      component: Projects,
      beforeEnter: requireAuth
    },
    {
      path: '/add_project',
      name: 'AddProject',
      component: AddProject,
      beforeEnter: requireAuth
    },
    {
      path: '/edit_project/:id/',
      name: 'EditProject',
      component: EditProject,
      beforeEnter: requireAuth
    },
    {
      path: '/sprints',
      name: 'Sprints',
      component: Sprints,
      beforeEnter: requireAuth
    },
    {
      path: '/add_sprint',
      name: 'AddSprint',
      component: AddSprint,
      beforeEnter: requireAuth
    }, 
    {
      path: '/edit_sprint/:id/',
      name: 'EditSprint',
      component: EditSprint,
      beforeEnter: requireAuth
    },
    {
      path: '/tasks',
      name: 'Tasks',
      component: Tasks,
      beforeEnter: requireAuth
    },
    {
      path: '/add_task',
      name: 'AddTask',
      component: AddTask,
      beforeEnter: requireAuth
    },
    {
      path: '/edit_task/:id/',
      name: 'EditTask',
      component: EditTask,
      beforeEnter: requireAuth
    },     
    {
      path: '*',
      redirect: '/',
    }
  ]
})
