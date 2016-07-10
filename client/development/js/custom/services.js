angular.module('services', [])

       .factory('UserModule', function ($http) {

           var username = null;

           return {

               get isLoggedIn() {
                   return Boolean(username);
               },

               get username() {

                   return username;
               },

               set username(usernameToSet) {

                   username = usernameToSet;
               },

               checkUsername: function (username) {

                   return $http({
                       method  : 'POST',
                       url     : '/checkUsername',
                       dataType: 'JSON',
                       data    : angular.toJson({username: username})
                   });
               }
           }
       })

       .factory('ChatModule', function () {

           return {

               connection: null,
               address   : 'ws://localhost:3000',

               actionsFromServerMap: {
                   CLIENT_CONNECTED : 'onClientConnect',
                   CHAT_MESSAGE_SENT: 'onChatMessageSent'
               },

               clientActionsMap: {
                   SEND_MESSAGE: 'SEND_MESSAGE'
               },

               soundsMap: {
                   MESSAGE_ARRIVED: {
                       id    : 'MESSAGE_ARRIVED',
                       source: '/sounds/notify.mp3'
                   }
               },

               cache: {
                   sounds: {}
               },

               init: function () {

                   this.cacheSounds();
                   this.chaseOnlineUsers();

                   this.connection = window.io(this.address);
                   this.connection.on('message', this.onMessageFromServer.bind(this));
               },

               cacheSounds: function () {

                   var audio;
                   for (var soundEvent in this.soundsMap) {
                       if (!this.soundsMap.hasOwnProperty(soundEvent)) {
                           continue;
                       }
                       audio                                                     = new Audio();
                       audio.src                                                 = this.soundsMap[soundEvent].source;
                       this.cache.sounds[this.soundsMap[soundEvent].id] = audio;
                   }
               },

               chaseOnlineUsers: function () {

               },

               sendMessageToChat: function (message) {

                   this.publishAction(this.clientActionsMap.SEND_MESSAGE, message);
               },

               playSound: function (soundEvent) {

                   if (!this.cache.sounds.hasOwnProperty(soundEvent.id)) {
                       return;
                   }
                   this.cache.sounds[soundEvent.id].play();
               },

               /**
                * Main proxy from server for messages
                * @param {string} data - message and action in JSON format
                */
               onMessageFromServer: function (data) {

                   var message;

                   try {
                       message = JSON.parse(data);
                   } catch (e) {
                       return;
                   }

                   if (!(message.action && message.action in this.actionsFromServerMap)) {
                       return;
                   }

                   this[this.actionsFromServerMap[message.action]].call(this, message);
               },

               onClientConnect: function () {

                   console.log('inited');
               },

               /**
                * Triggers when message arrives from server
                * @param {object} message - object with data and action to run
                */
               onChatMessageSent: function (message) {

                   if (this.connection.id === message.from) {
                       return;
                   }
                   this.playSound(this.soundsMap.MESSAGE_ARRIVED);
               },

               /**
                * Emits message with some data
                * @param {String} action, command to run with data
                * @param {String} [data] text to send
                */
               publishAction: function (action, data) {

                   if (action === this.clientActionsMap.SEND_MESSAGE && !data) {
                       return;
                   }

                   var infoToSend = {
                       action: action,
                       data  : data,
                       from  : this.connection.id
                   };
                   this.connection.emit('message', JSON.stringify(infoToSend));
               }
           }
       });