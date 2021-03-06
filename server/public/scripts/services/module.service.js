myApp.service('ModuleService', ['$http', '$location', '$routeParams', '$q', function ($http, $location, $routeParams, $q) {
    let self = this;

    self.module = {};
    self.components = { data: [] };
    self.componentsSaved = {};
    self.calculations = { data: {}};

    self.moduleLibrary = {list:[{}]};
    self.isSaving = { status: false };
    self.hasUnsavedChanges = { status: false };
    self.hasUnsavableChanges = { status: false };


    /******************************************/
    /*              GET REQUESTS              */
    /******************************************/
    // get all modules
    self.getModules = function() {
        // get the modules
        $http.get(`/api/module/all`)
          .then( function(response) {
            self.moduleLibrary.list = response.data;
          })
          .catch( function(error) {
            console.log(error);
          });
    };
    self.getModules(); //Calls all modules on service load (mainly for shopping list creation area)
    // get single module
    self.getModule = function() {
        $http.get('/api/module/' + $routeParams.id)
            .then(response => {
                self.module.data = response.data[0];
                
                // get this module's components
                self.getModuleComponents();
            })
            .catch(error => {
                console.log('error in get', error);
            });
    };
    self.getModuleComponents = function() {
        $http.get('/api/module/components/' + $routeParams.id)
            .then(response => {

                // sort alphabetically
                response.data.sort(function(a,b) { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} ); 
                self.components.data = response.data;
                console.log(self.components.data);
                
                self.getCostRates();
            })
            .catch(error => {
                console.log('error in get', error);
            });
    };

    self.getModuleComponentsPreSave = function() {
        $http.get('/api/module/components/' + $routeParams.id)
            .then(response => {
                self.componentsSaved.data = response.data;
            })
            .catch(error => {
                console.log('error in get', error);
            });
    };

    self.getCostRates = function() {
        $http.get('/api/module/cost/rates/' + $routeParams.id)
            .then(response => {
                self.calculations.data = response.data;
            })
            .catch(error => {

                // usually an error comes because there are no calculations to run.
                // in this case, we'll provide an object with 0 for all of the calculations.
                // otherwise, after creating a new module, you see the calculations from the last module visited.
                self.calculations.data = {
                    currentSum: 0,
                    currentKitSum: 0,
                    laborCost: 0,
                    current_and_labor_sum: 0,
                    kit_and_labor_sum: 0,
                };
            });
    };

    /******************************************/
    /*             POST REQUESTS              */
    /******************************************/

    self.createModule = function() {
        $http.post('/api/module', self.module.data)
            .then(response => {
                $location.path('/module/' + response.data[0].id);
                // swal({
                //     title: `Module ${self.module.data.name} has been created!`,
                //     icon: "success",
                //     timer: 1200,
                //     buttons: false
                // })
            })
            .catch(error => {
                console.log('error in post', error);
            });
    };

    self.addModuleComponent = function(componentId, piecesPerKit) {
        const dataToSend = {
            module_id: $routeParams.id,
            component_id: componentId,
            pieces_per_kit: piecesPerKit
        };

        $http.post('/api/module/components', dataToSend)
            .then(response => {
                // TODO: Remove after QC. Fix #1: don't update component list on edits, only on refresh
                // self.getModule();
            })
            .catch(error => {
                console.log('error in add module component', error);
            });

    }

    // Draft version
    self.addModuleComponentToDraft = function(componentId, piecesPerKit = 0, componentData) {
        if(!piecesPerKit) {
            piecesPerKit = 0;
        }
        // TODO: Fix #2: Check duplicate issues here

        // check if it's already in the module
        let componentIsInModule = false;
        for (let i = 0; i < self.components.data.length; i++) {
            if (self.components.data[i].component_id == componentId) {
                componentIsInModule = true;
            }
        }

        // if it isn't already here, then add it.
        if (!componentIsInModule) {
            // unshift that component to the list
            self.components.data.unshift(
                {
                    // module_id: 34, // not needed?
                    component_id: componentId, 
                    pieces_per_kit: piecesPerKit,
                    id: componentData.id,
                    name: componentData.name,
                    description: componentData.description,
                    vendor_name_primary: componentData.vendor_name_primary,
                    vendor_url_primary: componentData.vendor_url_primary,
                    vendor_name_secondary: componentData.vendor_name_secondary,
                    vendor_url_secondary: componentData.vendor_url_secondary,
                    notes: componentData.notes,
                    price_per_unit: componentData.price_per_unit,
                    pieces_per_unit: componentData.pieces_per_unit,
                    consumable: componentData.consumable,
                    type: componentData.type,
                    general_stock_item: componentData.general_stock_item
                }
            );
        } else {
            alert('already in module');
        }

    }

    /******************************************/
    /*              PUT REQUESTS              */
    /******************************************/

    self.updateModule = function() {
        $http.put('/api/module', self.module.data)
            .then(response => {
                // no action on response
                // swal({
                //     title: `Module has been saved!`,
                //     icon: "success",
                //     timer: 1200,
                //     buttons: false
                // });

                // we want to see the new cost when the cost is improved
                self.getCostRates();

                // update saved changes status
                self.hasUnsavedChanges.status = false;
            })
            .catch(error => {
                console.log('error in put', error);
            });
    };
    self.updateModuleComponent = function(component) {

        // reduce the row data to the junction table row's data
        let moduleComponentToSave = {
            module_id: $routeParams.id,
            component_id: component.component_id,
            pieces_per_kit: component.pieces_per_kit
        };

        $http.put('/api/module/components', moduleComponentToSave)
            .then(response => {
                // no action on response
            })
            .catch(error => {
                console.log('error in put', error);
            });
    };

    // Post new module components
    self.updateModuleEverythingComponentsPost = function() {
        // Get list of components to post
        let componentsToPost = [];
        for (let i = 0; i < self.components.data.length; i++) {
            
            // if the array length is zero, you can't check it, so just push it.
            if (self.componentsSaved.data.length == 0) {
                componentsToPost.push(self.components.data[i]);
            } else {
                for (let j = 0; j < self.componentsSaved.data.length; j++) {
                    if (self.components.data[i].component_id == self.componentsSaved.data[j].component_id) {
                        break;
                    }
                    if (j == self.componentsSaved.data.length - 1) {
                        componentsToPost.push(self.components.data[i]);
                    }
                }
            }
        }
        return componentsToPost;

    };

    // Delete Module Components
    self.updateModuleEverythingComponentsDelete = function() {
        // Get list of components to delete
        let componentsToDelete = [];
        for (let i = 0; i < self.componentsSaved.data.length; i++) {

            // if the array length is zero, you can't check it, so just push it.
            if (self.components.data.length == 0) {
                componentsToDelete.push(self.componentsSaved.data[i]);
            } else {
                for (let j = 0; j < self.components.data.length; j++) {
                    if (self.componentsSaved.data[i].component_id == self.components.data[j].component_id) {
                        break;
                    }
                    if (j == self.components.data.length - 1) {
                        componentsToDelete.push(self.componentsSaved.data[i]);
                    }
                }
            }
        }
        return componentsToDelete;
    };

    self.updateModuleEverything = function() {
        // self.getModuleComponentsPreSave();
        $http.get('/api/module/components/' + $routeParams.id)
            .then(response => {
                self.componentsSaved.data = response.data;

                let allRequests = [];

                // Post new components
                let componentsToPost = self.updateModuleEverythingComponentsPost();
                for (let i = 0; i < componentsToPost.length; i++) {

                    const dataToSend = {
                        module_id: $routeParams.id,
                        component_id: componentsToPost[i].component_id,
                        pieces_per_kit: componentsToPost[i].pieces_per_kit
                    };
                    allRequests.push($http.post('/api/module/components', dataToSend));

                    // self.addModuleComponent(componentsToPost[i].component_id, componentsToPost[i].pieces_per_kit);
                }

                // Delete components
                let componentsToDelete = self.updateModuleEverythingComponentsDelete();
                for (let i = 0; i < componentsToDelete.length; i++) {
                    allRequests.push($http.delete('/api/module/components/' + self.module.data.id + '/' + componentsToDelete[i].component_id));
                    // self.deleteModuleComponent(self.module.data.id, componentsToDelete[i].component_id);
                }

                // Update quantities of existing components
                for (let i = 0; i < self.components.data.length; i++) {

                    // let moduleComponentToSave = {
                    //     module_id: $routeParams.id,
                    //     component_id: self.components.data[i].component_id,
                    //     pieces_per_kit: self.components.data[i].pieces_per_kit
                    // };

                    // allRequests.push($http.put('/api/module/components', moduleComponentToSave));
                    self.updateModuleComponent(self.components.data[i]);
                }

                $q.all(allRequests)
                    .then(response => {
                        self.isSaving.status = false;
                        console.log('SUCCESS', response)
                    })
                    .catch(error => {
                        console.log('error', error);
                    });

                // UPDATE THE MODULE
                self.updateModule();
                
                // self.getModuleComponents();

            })
            .catch(error => {
                console.log('error in get', error);
            });

    };

    /******************************************/
    /*            DELETE REQUESTS             */
    /******************************************/
    
    self.deleteModule = function(moduleId) {
        $http.delete('/api/module/' + moduleId)
            .then(response => {
                self.getModules();
                swal({
                    title: `Module has been deleted!`,
                    icon: "success",
                    timer: 1200,
                    buttons: false
                })
            })
            .catch(error => {
                console.log('error in delete', error);
            });
    };
    self.deleteModuleComponent = function(moduleId, componentId) {        
        $http.delete('/api/module/components/' + moduleId + '/' + componentId)
            .then(response => {
                // TODO: Remove after QC. Fix #1: don't update component list on edits, only on refresh
                // self.getModuleComponents();
            })
            .catch(error => {
                console.log('error in delete', error);
            });
    };

    // Deletes a component from the draft, so that it can be saved with the module save button
    self.deleteModuleComponentInDraft = function(moduleId, componentId) {
        for (let i = 0; i < self.components.data.length; i++) {
            if (self.components.data[i].module_id == moduleId && self.components.data[i].component_id == componentId) {
                self.components.data.splice(i, 1);
                break;
            }
        }
    };

    /******************************************/
    /*            OTHER FUNCTIONS             */
    /******************************************/

    // CALCULATIONS
    self.calculations = {};
    self.calculations.material_cost = 0;
    self.calculations.material_in_kit_cost = 0;
    self.calculations.estimated_labor_cost = 0;
    self.calculations.materials_ordered_labor = 0;
    self.calculations.materials_in_kit_labor = 0;
    
    // Initialize page: blank item if old, get item if new
    self.initializeData = function() {
        if ($routeParams.id) {
            self.getModule();
        } else {
            self.module.data = {};
        }
    }

    // Note when there are new unsaved changes
    self.newUnsavedChange = function() {
        self.hasUnsavedChanges.status = true;
    }

    // Save Module
    self.saveModule = function() {
        if ($routeParams.id) {
            self.updateModuleEverything();
        } else {
            self.createModule();
        }
    };

    self.sortModules = function(sortMethod) {
        $http.get(`/api/module/sorting/${sortMethod}`)
          .then( function(response) {
            self.moduleLibrary.list = response.data;
          })
          .catch( function(error) {
            console.log(error);
          });
      };
  

    
}]);
