;(function () {

    window.mediator = {
        _events: {},
        /**
         * subscribes for event to trigger later
         * @param {string} event
         * @param {function} callback
         */
        on: function (event, callback) {

            if (!event) {
                throw new Error('please specify event to subscribe');
            }

            if (typeof callback !== 'function') {
                throw new Error('callback must be a function');
            }

            if (this._events.hasOwnProperty(event)) {
                this._events[event].push(callback);
            } else {
                this._events[event] = [];
                this._events[event].push(callback);
            }
        },

        /**
         * triggers an event
         * @param {string} event
         * @param {*} dataToPass
         */
        trigger: function (event, dataToPass) {

            if (!this._events.hasOwnProperty(event)) {
                return;
            }
            this._events[event]
                .forEach(function (callback) {

                    callback.call(null, dataToPass);
                });
        },

        /**
         * removes event
         * @param {string} event to remove
         */
        off: function (event) {

            delete this._events[event];
        }
    };
})();