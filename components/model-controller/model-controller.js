// to handle the model control for 3d content
AFRAME.registerComponent('model-controller', {
    dependencies: ['gltf-model'],
    schema: {
        target: { default: '' },
        scaleStep: { type: 'number', default: 0.1 }
    },
    getSizeFromObj: function (object) {
        if (object instanceof THREE.Mesh) {
            // If geometry can be obtained from object, do not traverse the children
            var geometry = object.geometry;
            geometry.computeBoundingBox();
            object.updateMatrixWorld();
            return geometry.boundingBox.getSize(new THREE.Vector3());
        } else {
            // Fallback method as default
            object.updateMatrixWorld();
            console.log(new THREE.Box3().setFromObject(object));
            return new THREE.Box3().setFromObject(object).getSize(new THREE.Vector3());
        }
    },
    init: function () {
        if (this.data.target) {
            var target = document.querySelector(this.data.target);
            if (target) {
                this.target = target;
                this.target.addEventListener('mousedown', this.mousedown.bind(this));
                this.target.addEventListener('mousemove', this.mousemove.bind(this));
                this.target.addEventListener('mouseup', this.mouseup.bind(this));
                this.target.addEventListener('wheel', this.wheel.bind(this));


                this.el.addEventListener('model-loaded', function () {
                    this.el.removeEventListener('model-loaded', arguments.callee);
                    try {
                        // let size = this.getSizeFromObj(this.el.object3D);
                        // console.log(size);

                        let box = new THREE.Box3().setFromObject(this.el.object3D);
                        let size = new THREE.Vector3();
                        box.getSize(size);
                        console.log(box.min, box.max, size);
                        return;
                        // var max = Math.max(size.x, size.y, size.z);
                        // if (!isNaN(max) && max !== Infinity && max > 0.1) {
                        //     this.currScale = 15 / max; // 15 is according the experience, need to be confirmed;

                        //     this.el.object3D.scale.set(this.currScale, this.currScale, this.currScale);
                        // }
                    } catch (error) {
                        console.log('cannot get the size of the model, just let it be');
                    }

                }.bind(this));
            }
        }
    },
    mousedown: function (evt) {
        if (this.isDown) return;
        if (event.button == 0) {
            this.isDown = true;
            console.log(evt);
            this.x = evt.x;
            this.y = evt.y;
        }
    },
    mousemove: function (evt) {
        if (this.isDown) {
            let deltaX = evt.x - this.x;
            this.x += deltaX;
            let deltaY = evt.y - this.y;
            this.y += deltaY;
            this.el.object3D.rotation.y += deltaX * 0.01;
            this.el.object3D.rotation.x += deltaY * 0.01;
        }
    },
    mouseup: function (evt) {
        if (this.isDown) {
            this.isDown = false;
        }
    },
    wheel: function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        // console.log(evt.deltaY);
        if (evt.deltaY > 0) { // bigger
            this.currScale += this.data.scaleStep;
        } else {
            if (this.currScale - this.data.scaleStep > 0) this.currScale -= this.data.scaleStep;
        }
        this.el.object3D.scale.set(this.currScale, this.currScale, this.currScale);
        return false;
    },
    remove: function () {
        if (this.target) {
            this.target.removeEventListener('mousedown', this.mousedown.bind(this));
            this.target.removeEventListener('mousemove', this.mousemove.bind(this));
            this.target.removeEventListener('mouseup', this.mouseup.bind(this));
            this.target.removeEventListener('wheel', this.wheel.bind(this));
            delete this.target;
        }
    }
});
