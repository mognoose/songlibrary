<template>
    <div class="container">
        <h1>TabCreator</h1>
        <div class="guitar-neck">
            <div style="border: 0;">
                <div v-for="note in tuning[activeTuning]">
                    <span class="open" @click="addNote(note, activePart)" :class="{highlight: highlightedNote === note}">{{note}}</span>
                </div>
            </div>
            <div v-for="index in 12" :key="index">
                <div v-for="note in tuning[activeTuning]"><span @click="addNote(fret(note, index), activePart)" :class="{highlight: highlightedNote === fret(note, index)}">{{fret(note, index)}}</span></div>
            </div>
            <div class="settings-button">
                <svg-icon @click="changeTuning" :fa-icon="faGear" size="18" />
            </div>

        </div>
        
        <div class="tab-creator" v-for="tab, tabIndex in tabs" :key="tab.tabIndex" :class="{'active-part': activePart === tabIndex}">
            <div class="part-name" @click="setActivePart(tabIndex)">{{ formatPartName(tabIndex) }}</div>
            <div class="notes">
                <span v-for="note, i in tab.notes" :key="i">
                    {{ note }} | 
                </span>
            </div>
            <input type="text" placeholder="Section name" v-model="tab.name">
            <div class="notes-input">
                <span
                    class="note"
                    v-for="note, i in tab.notes"
                    :key="i"
                    @mouseover="highlightNote(note)"
                    @wheel.prevent="event => text = changeNote(tabIndex, note, i, 'change', event.deltaY)"
                    @contextmenu.prevent="changeNote(tabIndex, note, i, 'remove')"
                >
                    {{ note }}
                </span>
                <span
                    class="note"
                    @mouseover="highlightNote('new')"
                    @wheel.prevent="event => text = changeNote(tabIndex, 'new', 0, event.target.value, event.deltaY)"
                >
                    {{ '-' }}
                </span>
            </div>
        </div>
        <button class="button" @click="addSection()">Add new section</button>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {faGear} from "@fortawesome/free-solid-svg-icons";

export default {
    data() {
        return {
            tabs: [
                {name: 'intro', notes: []}
            ],
            tuning: [
                ['E', 'B', 'F#', 'B',],
                ['F', 'C', 'G', 'C',],
                ['G', 'D', 'A', 'E',],
                ['D', 'A', 'E', 'B',],
            ],
            notes: [
                'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#',
            ],
            highlightedNote: '',
            activePart: 0,
        }
    },
    setup() {
        return {faGear};
    },
    computed: {
        ...mapGetters(['activeTuning',])
    },
    methods: {
        ...mapActions(['setActiveTuning']),
        addSection() {
            this.tabs.push({name: '', notes: []})
            this.setActivePart(this.tabs.length-1);
        },
        highlightNote(note) {
            this.highlightedNote = note === 'new' ? '' : note;
        },
        addNote(note, part){
            this.tabs[part].notes.push(note)
        },
        changeNote(tabIndex, note, i, action, event) {
            if(action === 'remove') return this.tabs[tabIndex].notes.splice(i,1)
            if(note === 'new') return this.tabs[tabIndex].notes.push('B')
            const noteIndex = this.notes.findIndex(n => n === note)
            let newNote = this.notes[noteIndex+(event < 0 ? 1 : -1)]
            newNote = newNote ? newNote : (event < 0 ? 'B' : 'A#');
            this.tabs[tabIndex].notes[i] = newNote;
            this.highlightedNote = newNote;
        },
        formatPartName(i) {
            const name = this.tabs[i].name
            return '[ ' + name.charAt(0).toUpperCase() + name.substr(1).toLowerCase() + ' ]'
        },
        fret(n, fret){
            let index = this.notes.findIndex(note => note === n)+fret
            if (index >= 12) index = index-12;
            return this.notes[index]
        },
        setActivePart(active){
            this.activePart = active;
        },
        changeTuning() {
            let newTune = this.activeTuning+1
            if (newTune >= this.tuning.length) newTune = 0
            this.setActiveTuning(newTune)
        }
    },
}
</script>

<style lang="scss" scoped>
.container {
    max-width: 800px;
    margin: 0 auto;

    .guitar-neck {
        position: relative;
        display: grid;
        grid-template-columns: repeat(13, 1fr);
        border: 1px solid #121212;
        height: 10rem;
        padding-top: 2em;
        text-align: center;
        padding-right: 2em;

        .settings-button{
            position: absolute;
            top: 0;
            border: 0;
            padding: .5rem;
            opacity: .2;
            cursor: pointer;
        }

        .settings-button:hover {
            opacity: 1;
        }

        :first-child{
            div{
                border-top: 0;
                border: 0;
                border-right: 3px solid #333;
            }
        }
        
        div {
            border: 1px solid #333;
            border-top: 0;
            border-left: 0;
            height: 2rem;

            :first-child {
                border-top: 0;
            }
            
            div {
                span {
                    cursor: pointer;
                    opacity: .1;
                    background-color: #333;
                    display: inline-block;
                    position: relative;
                    line-height: 1.5rem;
                    border-radius: 50%;
                    top: 1.25rem;
                    border: 1px solid #000;
                    width: 1.5rem;
                    height: 1.5rem;
                }
                span:hover {
                    opacity: 1;
                }
            }
        }
    .open {
        opacity: 1;
        text-align: left;
        background-color: rgba(0,0,0,0);
        border: 0;
    }

    .highlight {
        opacity: 1;
        background-color: #333;
        text-align: center;
        display: inline-block;
        position: relative;
        line-height: 1.5rem;
        border-radius: 50%;
        top: 1.25rem;
        border: 1px solid #000;
        width: 1.5rem;
        height: 1.5rem;
    }
    }

    .tab-creator {
        margin: 1rem 0;
        padding: 1rem;
        text-align: left;

        .notes {
            margin-bottom: 1em;
        }

        .notes-input {
            .note {
                cursor: pointer;
                text-align: center;
                display: inline-block;
                border: 1px solid #121212;
                padding: .25rem;
                width: 1rem;
            }
        }

        input {
            width: 50%;
            box-sizing: border-box;
            border: 0 solid #000;
            border-bottom: 2px solid #333;
            background-color: #1a1a1a;
            border-radius: 0;
        }
    }
    .active-part{
        border-left: 3px solid #333;
    }
}
</style>
