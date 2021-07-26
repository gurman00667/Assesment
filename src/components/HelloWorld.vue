<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Todo List
        </h1>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-select
          style="width: 50%;"
          v-model="valueSelected"
          :items="items"
          label=""
          dense
          @change="changelist()"
          outlined
        ></v-select>
        <div style="width:50%;">
        <v-btn
          style="float: right; "
          class="ma-2"
          color="Green"
          dark
          @click="addItemDialog = true"
        >
          Add
        </v-btn>
        </div>
    </v-row>
    <v-row v-for="i in $store.state.apiResults" :key="i.id" justify="center" style="margin-bottom: auto;">
        <v-card style="width:50%;" outlined>
          <v-row>
          <v-col>
            <v-checkbox
              v-model="i.completed"
              :label="i.title"
              color="blue darken-3"
            ></v-checkbox>
          </v-col>
            <v-spacer/>
            <v-col>
              <v-btn
              style="float: right;"
              class="ma-2"
              color="green"
              dark
              @click="opendialogfunc(i)"
            >
              Edit
            </v-btn>
            </v-col>
          <v-col>
            <v-btn
              style="float: right;"
              class="ma-2"
              color="red"
              dark
              @click="deleteItem(i)"
            >
              Delete
            </v-btn>
          </v-col>
          </v-row>
        </v-card>
    </v-row>
    <v-dialog
         v-model="opendialog"
         width="350"
      >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Edit Task
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="inputString"
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="editItem()"
          >
            Save
          </v-btn>
          <v-btn
            color="red"
            text
            @click="opendialog = false"
          >
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addItemDialog" persistent max-width="600px" min-width="360px">
      <div>
          <v-card class="px-4">
            <v-card-text>
                <v-form ref="registerForm" lazy-validation>
                  <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="task" label="Task" maxlength="30" required></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-checkbox
                          v-model="completed"
                          :label="task"
                          color="blue darken-3"
                        ></v-checkbox>
                      </v-col>
                  </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="addItem()"
              >
                Add
              </v-btn>
              <v-btn
                color="red"
                text
                @click="addItemDialog = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
      </div>
    </v-dialog>
  </v-container>
</template>

<script>

import callApi from "../api";
  export default {
    name: 'HelloWorld',

    data: () => ({
    bottom: false,
    valueSelected: 'All',
    opendialog : false,
    inputString  : '',
    selectedItem : {},
    addItemDialog : false,
    completed  :false,
    task : '',
    items : ['All', 'Completed', 'Active'],
    apiResponse: [],
    }),
    async mounted(){
      if(this.$store.state.apiResults.length == 0){
        var res = await callApi();
        this.apiResponse = res.data;
      }
      window.addEventListener('scroll', () => {
        this.bottom = this.bottomVisible()
      })
      this.addListItem()
    },
    methods:{
      changelist(){
        if(this.valueSelected == "Completed"){
          this.$store.state.apiResults = this.apiResponse.filter(i=> i.completed == true);
        }
        if(this.valueSelected == "Active"){
          this.$store.state.apiResults = this.apiResponse.filter(i=> i.completed == false);
        }
        if(this.valueSelected == "All"){
          this.addListItem();
        }
      },
      bottomVisible() {
        const scrollY = window.scrollY
        const visible = document.documentElement.clientHeight
        const pageHeight = document.documentElement.scrollHeight
        const bottomOfPage = visible + scrollY >= pageHeight
        return bottomOfPage || pageHeight < visible
      },

      clickCheckbox(){

      },
      deleteItem(e){
        const res =  this.$store.state.apiResults;
        for( var i = 0; i < res.length; i++){ 
    
        if ( res[i].id === e.id) { 
    
            this.$store.state.apiResults.splice(i, 1); 
        }
    
    }
      },
      editItem(){
        const res =  this.$store.state.apiResults;
        if(res){
           for(let i= 0 ; i <= res.length ; i++ ){
            if (res[i].id == this.selectedItem.id){
              res[i].title = this.inputString;
              break;
            }
          }
        }
       this.opendialog = false;
        
      },
      addItem(){
        var len = this.$store.state.apiResults.length;
        var obj = {
          userId : 6,
          id : len+2,
          title : this.task,
          completed : this.completed
        }
        this.$store.state.apiResults.unshift(obj);
        this.addItemDialog = false;
        alert("successfully added at the top of list"); 
      },
      opendialogfunc(i){
        this.inputString= i.title;
        this.selectedItem = i,
        this.opendialog = true;
      },
      addListItem() {
        var len = this.$store.state.apiResults.length + 10;
        var extract = this.apiResponse.filter(elem => elem.id < len);
        this.$store.state.apiResults = extract;
      }
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.addListItem()
      }
    }
  },
  }
</script>
