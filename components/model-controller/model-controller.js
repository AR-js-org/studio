// to handle the model control for 3d content
AFRAME.registerComponent('model-controller', {
    dependencies: ['gltf-model'],
    schema: {
        target: { default: '' },
    },
    init: function () {
        this.enableAction = false;
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
                        let size = new THREE.Vector3();;
                        let box = this.getSizeFromObj(this.el.object3D);
                        box.getSize(size);

                        window.assetParam.scale = 1;
                        window.assetParam.size = {
                            width: box.max.x - box.min.x,
                            height: box.max.y - box.min.y,
                            depth: box.max.z - box.min.z,
                        };


                        var max = Math.max(size.x, size.y, size.z);

                        if (!isNaN(max) && max !== Infinity && max > 0.1) {
                            this.currScale = 2 / max; // 2 is according the experience, need to be confirmed;
                            this.minScale = 0.1 * this.currScale;
                            this.maxScale = 3 * this.currScale;
                            this.scaleStep = this.minScale;
                            window.assetParam.scale = this.currScale;
                            this.el.setAttribute('scale', `${this.currScale} ${this.currScale} ${this.currScale}`);
                            this.enableAction = true;
                        }
                    } catch (error) {
                        console.log('cannot get the size of the model, just let it be');
                    }

                }.bind(this));
            }
        }
    },
    mousedown: function (evt) {
        if (this.isDown) return;
        if (this.enableAction && event.button == 0) {
            this.isDown = true;
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
        if (this.enableAction) {
            evt.stopPropagation();
            evt.preventDefault();
            if (evt.deltaY < 0) { // bigger
                if (this.currScale + this.scaleStep < this.maxScale) this.currScale += this.scaleStep;
            } else {
                if (this.currScale - this.scaleStep > this.minScale) this.currScale -= this.scaleStep;
            }
            window.assetParam.scale = this.currScale;
            this.el.object3D.scale.set(this.currScale, this.currScale, this.currScale);
        }
        return false;
    },
    getSizeFromObj: function (object) {
        var box3 = new THREE.Box3();
        var v1 = new THREE.Vector3();
        var i, l;
        function traverse(node) {
            var geometry = node.geometry;

            if (geometry !== undefined) {
                if (geometry.isGeometry) {
                    var vertices = geometry.vertices;

                    for (i = 0, l = vertices.length; i < l; i++) {
                        v1.copy(vertices[i]);
                        v1.applyMatrix4(node.matrixWorld);

                        if (isNaN(v1.x) || isNaN(v1.y) || isNaN(v1.z)) continue;

                        box3.expandByPoint(v1);
                    }
                } else if (geometry.isBufferGeometry) {
                    var attribute = geometry.attributes.position;

                    if (attribute !== undefined) {
                        for (i = 0, l = attribute.count; i < l; i++) {
                            v1.fromBufferAttribute(attribute, i).applyMatrix4(node.matrixWorld);

                            if (isNaN(v1.x) || isNaN(v1.y) || isNaN(v1.z)) continue;
                            box3.expandByPoint(v1);
                        }
                    }
                }
            }
        }

        object.updateMatrixWorld(true);
        object.traverse(traverse);
        return box3;
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
