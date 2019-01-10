define(["require", "exports", "../../Common/tsm/vec3", "../../Common/tsm/quat"], function (require, exports, vec3_1, quat_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Face;
    (function (Face) {
        Face[Face["Red"] = 0] = "Red";
        Face[Face["Orange"] = 1] = "Orange";
        Face[Face["Yellow"] = 2] = "Yellow";
        Face[Face["Green"] = 3] = "Green";
        Face[Face["Blue"] = 4] = "Blue";
        Face[Face["White"] = 5] = "White";
    })(Face || (Face = {}));
    exports.Face = Face;
    class Cubie {
        constructor(offset, faces, orientation = quat_1.default.identity.copy()) {
            this.position = offset;
            this.orientation = orientation;
            this.faces = faces;
        }
    }
    exports.Cubie = Cubie;
    /**
     * Immutable class to store one state of a Rubik's Cube
     */
    class CubeState {
        constructor(cubies) {
            this.cubies = cubies;
        }
        ;
        // White on top, green facing the camera
        static default() {
            // * remember +1 in z is towards camera
            let cubies = [
                // Left slice (row-major order)
                new Cubie(new vec3_1.default([-1, -1, -1]), [Face.Orange, null, Face.Yellow, null, Face.Blue, null]),
                new Cubie(new vec3_1.default([-1, -1, 0]), [Face.Orange, null, Face.Yellow, null, null, null]),
                new Cubie(new vec3_1.default([-1, -1, 1]), [Face.Orange, null, Face.Yellow, null, null, Face.Green]),
                new Cubie(new vec3_1.default([-1, 0, -1]), [Face.Orange, null, null, null, Face.Blue, null]),
                new Cubie(new vec3_1.default([-1, 0, 0]), [Face.Orange, null, null, null, null, null]),
                new Cubie(new vec3_1.default([-1, 0, 1]), [Face.Orange, null, null, null, null, Face.Green]),
                new Cubie(new vec3_1.default([-1, 1, -1]), [Face.Orange, null, null, Face.White, Face.Blue, null]),
                new Cubie(new vec3_1.default([-1, 1, 0]), [Face.Orange, null, null, Face.White, null, null]),
                new Cubie(new vec3_1.default([-1, 1, 1]), [Face.Orange, null, null, Face.White, null, Face.Green]),
                // Mid slice (row-major order)
                new Cubie(new vec3_1.default([0, -1, -1]), [null, null, Face.Yellow, null, Face.Blue, null]),
                new Cubie(new vec3_1.default([0, -1, 0]), [null, null, Face.Yellow, null, null, null]),
                new Cubie(new vec3_1.default([0, -1, 1]), [null, null, Face.Yellow, null, null, Face.Green]),
                new Cubie(new vec3_1.default([0, 0, -1]), [null, null, null, null, Face.Blue, null]),
                new Cubie(new vec3_1.default([0, 0, 0]), [null, null, null, null, null, null]),
                new Cubie(new vec3_1.default([0, 0, 1]), [null, null, null, null, null, Face.Green]),
                new Cubie(new vec3_1.default([0, 1, -1]), [null, null, null, Face.White, Face.Blue, null]),
                new Cubie(new vec3_1.default([0, 1, 0]), [null, null, null, Face.White, null, null]),
                new Cubie(new vec3_1.default([0, 1, 1]), [null, null, null, Face.White, null, Face.Green]),
                // Right slice (row-major order)
                new Cubie(new vec3_1.default([1, -1, -1]), [null, Face.Red, Face.Yellow, null, Face.Blue, null]),
                new Cubie(new vec3_1.default([1, -1, 0]), [null, Face.Red, Face.Yellow, null, null, null]),
                new Cubie(new vec3_1.default([1, -1, 1]), [null, Face.Red, Face.Yellow, null, null, Face.Green]),
                new Cubie(new vec3_1.default([1, 0, -1]), [null, Face.Red, null, null, Face.Blue, null]),
                new Cubie(new vec3_1.default([1, 0, 0]), [null, Face.Red, null, null, null, null]),
                new Cubie(new vec3_1.default([1, 0, 1]), [null, Face.Red, null, null, null, Face.Green]),
                new Cubie(new vec3_1.default([1, 1, -1]), [null, Face.Red, null, Face.White, Face.Blue, null]),
                new Cubie(new vec3_1.default([1, 1, 0]), [null, Face.Red, null, Face.White, null, null]),
                new Cubie(new vec3_1.default([1, 1, 1]), [null, Face.Red, null, Face.White, null, Face.Green]),
            ];
            return new CubeState(cubies);
        }
        apply_rotation(cubies, rot) {
            cubies.map(cubie => {
                rot.multiplyVec3(cubie.position, cubie.position); // 2nd arg is an output parameter
                cubie.position.x = Math.round(cubie.position.x);
                cubie.position.y = Math.round(cubie.position.y);
                cubie.position.z = Math.round(cubie.position.z);
                cubie.orientation = rot.copy().multiply(cubie.orientation);
                // TODO: "round" orientation to 90* angles
                //cubie.orientation.normalize();
            });
        }
        /// R turns rotate the right slice
        rotate_r() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.x == 1), rot);
            return new CubeState(cubies);
        }
        rotate_r_ccw() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.x == 1), rot);
            return new CubeState(cubies);
        }
        rotate_r2() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.x == 1), rot);
            return new CubeState(cubies);
        }
        /// M (middle layer) turns are a turn of the slice in between slices L and R, in the direction of an L turn
        rotate_m() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.x == 0), rot);
            return new CubeState(cubies);
        }
        rotate_m_ccw() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.x == 0), rot);
            return new CubeState(cubies);
        }
        rotate_m2() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.x == 0), rot);
            return new CubeState(cubies);
        }
        /// L turns rotate the left slice
        rotate_l() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.x == -1), rot);
            return new CubeState(cubies);
        }
        rotate_l_ccw() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.x == -1), rot);
            return new CubeState(cubies);
        }
        rotate_l2() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.x == -1), rot);
            return new CubeState(cubies);
        }
        /// U turns rotate the top slice
        rotate_u() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.y == 1), rot);
            return new CubeState(cubies);
        }
        rotate_u_ccw() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.y == 1), rot);
            return new CubeState(cubies);
        }
        rotate_u2() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.y == 1), rot);
            return new CubeState(cubies);
        }
        /// E (equitorial layer) turns are a turn of the slice in between slices U and D, in the direction of a D turn
        rotate_e() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.y == 0), rot);
            return new CubeState(cubies);
        }
        rotate_e_ccw() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.y == 0), rot);
            return new CubeState(cubies);
        }
        rotate_e2() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.y == 0), rot);
            return new CubeState(cubies);
        }
        /// D turns rotate the bottom slice
        rotate_d() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.y == -1), rot);
            return new CubeState(cubies);
        }
        rotate_d_ccw() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.y == -1), rot);
            return new CubeState(cubies);
        }
        rotate_d2() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.y == -1), rot);
            return new CubeState(cubies);
        }
        /// F turns rotate the front slice
        rotate_f() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.z == 1), rot);
            return new CubeState(cubies);
        }
        rotate_f_ccw() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.z == 1), rot);
            return new CubeState(cubies);
        }
        rotate_f2() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.z == 1), rot);
            return new CubeState(cubies);
        }
        // S (standing layer) turn sare a turn of the slice in between slices F and B, in the direction of an F turn
        rotate_s() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.z == 0), rot);
            return new CubeState(cubies);
        }
        rotate_s_ccw() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.z == 0), rot);
            return new CubeState(cubies);
        }
        rotate_s2() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.z == 0), rot);
            return new CubeState(cubies);
        }
        /// B turns rotate the back slice
        rotate_b() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.z == -1), rot);
            return new CubeState(cubies);
        }
        rotate_b_ccw() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, -Math.PI / 2);
            this.apply_rotation(cubies.filter(c => c.position.z == -1), rot);
            return new CubeState(cubies);
        }
        rotate_b2() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI);
            this.apply_rotation(cubies.filter(c => c.position.z == -1), rot);
            return new CubeState(cubies);
        }
        /// Reorients the entire cube with a rotation around the x-axis
        rotate_x() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, -Math.PI / 2);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        rotate_x_ccw() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI / 2);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        rotate_x2() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.right, Math.PI);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        ///Reorients the entire cube with a rotation around the y-axis
        rotate_y() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, -Math.PI / 2);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        rotate_y_ccw() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI / 2);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        rotate_y2() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.up, Math.PI);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        /// Reorients the entire cube with a rotation around the z-axis
        rotate_z() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, -Math.PI / 2);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        rotate_z_ccw() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI / 2);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
        rotate_z2() {
            var cubies = this.cubies.slice(0); // Creates a copy of this.cubies
            let rot = quat_1.default.fromAxisAngle(vec3_1.default.forward, Math.PI);
            this.apply_rotation(cubies, rot);
            return new CubeState(cubies);
        }
    }
    exports.CubeState = CubeState;
});
