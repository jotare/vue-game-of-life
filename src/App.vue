<template>
<div id="app" class="container">

  <section class="section">
    <table
      @mousedown="on_mouse_down"
      @mouseup="on_mouse_up">
      <tr v-for="i in size.height" :key="i">
        <td
          v-for="j in size.width" :key="j"
          :x="i" :y="j"
          :class="{ alife: universe[i-1][j-1] , dead: !universe[i-1][j-1]}"
          @click="toggle_cell"
          @mouseover="drag_toggle_cell">
        </td>
      </tr>
    </table>
  </section>

  <div>
    <div class="buttons is-centered">
      <button @click="random" class="button is-primary">
        Random
      </button>
      <button @click="play" v-if="!is_playing" class="button is-info">
        <i class="fa fa-solid fa-play"></i>
      </button>
      <button @click="pause" v-if="is_playing" class="button is-info">
        <i class="fa fa-solid fa-pause"></i>
      </button>
      <button @click="step" class="button is-info">
        Step
      </button>
      <button @click="clear" class="button is-danger">
        Clear
      </button>
    </div>
  </div>

</div>
</template>

<script>
function clone(array) {
    return JSON.parse(JSON.stringify(array));
}

function is_equal(A, B) {
    return JSON.stringify(A) == JSON.stringify(B);
}

export default {
    name: "App",
    data() {
        let height = 40;
        let width = 60;

        return {
            universe: Array(height).fill().map(() => Array(width).fill(0)),
            size: {
                width: width,
                height: height
            },
            timer: null,
            timeout: 10,
            is_mouse_clicked: false
        }
    },
    computed: {
        is_playing() {
            return this.timer != null;
        }
    },
    methods: {
        on_mouse_down() { this.is_mouse_clicked = true; },
        on_mouse_up() { this.is_mouse_clicked = false; },
        
        is_alive(x, y) {
            return this.universe[x][y];
        },
        drag_toggle_cell(evt) {
            if (this.is_mouse_clicked)
                this.toggle_cell(evt);
        },
        toggle_cell(evt) {
            let x = evt.target.attributes.x.value - 1;
            let y = evt.target.attributes.y.value - 1;
            this.universe[x][y] = this.is_alive(x, y) ? 0 : 1;
        },
        clear_universe() {
            for (let i = 0; i < this.size.height; i++) {
                for (let j = 0; j < this.size.width; j++) {
                    this.universe[i][j] = 0;
                }
            }
        },
        random_universe() {
            for (let i = 1; i < this.size.height-1; i++) {
                for (let j = 1; j < this.size.width-1; j++) {
                    let r = Math.random() * 1.25;
                    this.universe[i][j] = r < 1 ? 0 : 1;
                }
            }
        },
        update_universe() {
            let new_universe = clone(this.universe);
            for (let i = 1; i < this.size.height-1; i++) {
                for (let j = 1; j < this.size.width-1; j++) {
                    let neighbours = 
                        this.universe[i-1][j-1]
                        + this.universe[i-1][j]
                        + this.universe[i-1][j+1]
                        + this.universe[i][j-1]
                        + this.universe[i][j+1]
                        + this.universe[i+1][j-1]
                        + this.universe[i+1][j]
                        + this.universe[i+1][j+1];

                    if (neighbours < 2)
                        // underpopulation
                        new_universe[i][j] = 0;
                    else if (neighbours == 2)
                        // survive
                        ;
                    else if (neighbours == 3)
                        // life (survive or reproduction)
                        new_universe[i][j] = 1;
                    else
                        // die
                        new_universe[i][j] = 0;
                }
            }

            let changed = !is_equal(this.universe, new_universe);
            this.universe = new_universe;
            return changed;
        },

        clear() {
            this.clear_universe();
        },
        random() {
            this.random_universe();
        },
        play() {
            if (this.timer == null) {
                this.timer = setInterval(() => {
                    let changed = this.update_universe();
                    if (!changed)
                        this.pause();
                }, this.timeout)
            }
        },
        pause() {
            clearInterval(this.timer);
            this.timer = null;
        },
        step() {
            this.update_universe();
        },
    }
};
</script>

<style lang="scss">
#app {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.section {
    padding: 1rem 1rem;
}

table {
    border: 5px solid cyan;
}

td {
    height: 15px;
    width: 15px;
    border: 1px solid cyan;
}

.alife {
    background-color: white;
}

.dead {
    background-color: black;
}
</style>
