System.register(["./stopwatch/stopwatch.component", "./breadcrumbs/breadcrumbs.component", "./card/card.component", "./dropdown/dropdown.component", "./fancy-list/fancy-list.component", "./hot-links/hot-links.component", "./images/single-image/single-image.component", "./images/multiple-images/multiple-images.component", "./modal/modal.component", "./pagination/pagination.component", "./searchbar/searchbar.component", "./snackbar/snackbar.component", "./tabs/tabs.component", "./vertical-menu/vertical-menu.component", "./forms/field.component", "./date-picker/date-picker-input.component", "./date-picker/date-picker.component", "./tabs/tab.component", "./dropdown/dropdown-container.component", "./datatable/datatable.component", "./datatable/column.component", "./datatable/column-template-loader.component", "./forms/auto-focus-input.directive", "./accordion/accordion.component", "./accordion/accordion-item.component", "./stepper/stepper.component", "./tooltip/tooltip.component", "./buttons/floating-action-button/floating-action-button.component", "./time-picker/time-picker.component", "./dragdrop/dragable.component", "./dragdrop/dropzone.component", "./icon-generator/icon-generator.component", "./toolbar/toolbar.component", "./date-picker/date-picker-util"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var stopwatch_component_1, breadcrumbs_component_1, card_component_1, dropdown_component_1, fancy_list_component_1, hot_links_component_1, single_image_component_1, multiple_images_component_1, modal_component_1, pagination_component_1, searchbar_component_1, snackbar_component_1, tabs_component_1, vertical_menu_component_1, field_component_1, date_picker_input_component_1, date_picker_component_1, tab_component_1, dropdown_container_component_1, datatable_component_1, column_component_1, column_template_loader_component_1, auto_focus_input_directive_1, accordion_component_1, accordion_item_component_1, stepper_component_1, tooltip_component_1, floating_action_button_component_1, time_picker_component_1, dragable_component_1, dropzone_component_1, icon_generator_component_1, toolbar_component_1;
    var COMPONENTS;
    return {
        setters:[
            function (stopwatch_component_1_1) {
                stopwatch_component_1 = stopwatch_component_1_1;
                exports_1({
                    "StopwatchComponent": stopwatch_component_1_1["StopwatchComponent"]
                });
            },
            function (breadcrumbs_component_1_1) {
                breadcrumbs_component_1 = breadcrumbs_component_1_1;
                exports_1({
                    "BreadcrumbsComponent": breadcrumbs_component_1_1["BreadcrumbsComponent"]
                });
            },
            function (card_component_1_1) {
                card_component_1 = card_component_1_1;
                exports_1({
                    "CardComponent": card_component_1_1["CardComponent"]
                });
            },
            function (dropdown_component_1_1) {
                dropdown_component_1 = dropdown_component_1_1;
                exports_1({
                    "DropdownComponent": dropdown_component_1_1["DropdownComponent"]
                });
            },
            function (fancy_list_component_1_1) {
                fancy_list_component_1 = fancy_list_component_1_1;
                exports_1({
                    "FANCY_LIST_DIRECTIVES": fancy_list_component_1_1["FANCY_LIST_DIRECTIVES"]
                });
            },
            function (hot_links_component_1_1) {
                hot_links_component_1 = hot_links_component_1_1;
                exports_1({
                    "HotLinksComponent": hot_links_component_1_1["HotLinksComponent"]
                });
            },
            function (single_image_component_1_1) {
                single_image_component_1 = single_image_component_1_1;
                exports_1({
                    "SingleImageComponent": single_image_component_1_1["SingleImageComponent"]
                });
            },
            function (multiple_images_component_1_1) {
                multiple_images_component_1 = multiple_images_component_1_1;
                exports_1({
                    "MultipleImagesComponent": multiple_images_component_1_1["MultipleImagesComponent"]
                });
            },
            function (modal_component_1_1) {
                modal_component_1 = modal_component_1_1;
                exports_1({
                    "ModalComponent": modal_component_1_1["ModalComponent"]
                });
            },
            function (pagination_component_1_1) {
                pagination_component_1 = pagination_component_1_1;
                exports_1({
                    "PaginationComponent": pagination_component_1_1["PaginationComponent"]
                });
            },
            function (searchbar_component_1_1) {
                searchbar_component_1 = searchbar_component_1_1;
                exports_1({
                    "SearchbarComponent": searchbar_component_1_1["SearchbarComponent"]
                });
            },
            function (snackbar_component_1_1) {
                snackbar_component_1 = snackbar_component_1_1;
                exports_1({
                    "SnackbarComponent": snackbar_component_1_1["SnackbarComponent"]
                });
            },
            function (tabs_component_1_1) {
                tabs_component_1 = tabs_component_1_1;
                exports_1({
                    "TabsComponent": tabs_component_1_1["TabsComponent"],
                    "TABS_DIRECTIVES": tabs_component_1_1["TABS_DIRECTIVES"]
                });
            },
            function (vertical_menu_component_1_1) {
                vertical_menu_component_1 = vertical_menu_component_1_1;
                exports_1({
                    "VerticalMenuComponent": vertical_menu_component_1_1["VerticalMenuComponent"]
                });
            },
            function (field_component_1_1) {
                field_component_1 = field_component_1_1;
                exports_1({
                    "FieldComponent": field_component_1_1["FieldComponent"]
                });
            },
            function (date_picker_input_component_1_1) {
                date_picker_input_component_1 = date_picker_input_component_1_1;
                exports_1({
                    "DatePickerInputComponent": date_picker_input_component_1_1["DatePickerInputComponent"]
                });
            },
            function (date_picker_component_1_1) {
                date_picker_component_1 = date_picker_component_1_1;
                exports_1({
                    "DatePickerComponent": date_picker_component_1_1["DatePickerComponent"]
                });
            },
            function (tab_component_1_1) {
                tab_component_1 = tab_component_1_1;
                exports_1({
                    "TabComponent": tab_component_1_1["TabComponent"]
                });
            },
            function (dropdown_container_component_1_1) {
                dropdown_container_component_1 = dropdown_container_component_1_1;
                exports_1({
                    "DropdownContainerComponent": dropdown_container_component_1_1["DropdownContainerComponent"]
                });
            },
            function (datatable_component_1_1) {
                datatable_component_1 = datatable_component_1_1;
                exports_1({
                    "DataTableComponent": datatable_component_1_1["DataTableComponent"]
                });
            },
            function (column_component_1_1) {
                column_component_1 = column_component_1_1;
                exports_1({
                    "ColumnComponent": column_component_1_1["ColumnComponent"]
                });
            },
            function (column_template_loader_component_1_1) {
                column_template_loader_component_1 = column_template_loader_component_1_1;
                exports_1({
                    "ColumnTemplateLoaderComponent": column_template_loader_component_1_1["ColumnTemplateLoaderComponent"]
                });
            },
            function (auto_focus_input_directive_1_1) {
                auto_focus_input_directive_1 = auto_focus_input_directive_1_1;
                exports_1({
                    "AutoFocusInputDirective": auto_focus_input_directive_1_1["AutoFocusInputDirective"]
                });
            },
            function (accordion_component_1_1) {
                accordion_component_1 = accordion_component_1_1;
                exports_1({
                    "AccordionComponent": accordion_component_1_1["AccordionComponent"]
                });
            },
            function (accordion_item_component_1_1) {
                accordion_item_component_1 = accordion_item_component_1_1;
                exports_1({
                    "AccordionItemComponent": accordion_item_component_1_1["AccordionItemComponent"]
                });
            },
            function (stepper_component_1_1) {
                stepper_component_1 = stepper_component_1_1;
                exports_1({
                    "STEPPER_DIRECTIVES": stepper_component_1_1["STEPPER_DIRECTIVES"]
                });
            },
            function (tooltip_component_1_1) {
                tooltip_component_1 = tooltip_component_1_1;
                exports_1({
                    "TooltipComponent": tooltip_component_1_1["TooltipComponent"]
                });
            },
            function (floating_action_button_component_1_1) {
                floating_action_button_component_1 = floating_action_button_component_1_1;
                exports_1({
                    "FloatingActionButtonComponent": floating_action_button_component_1_1["FloatingActionButtonComponent"]
                });
            },
            function (time_picker_component_1_1) {
                time_picker_component_1 = time_picker_component_1_1;
                exports_1({
                    "TimePickerComponent": time_picker_component_1_1["TimePickerComponent"]
                });
            },
            function (dragable_component_1_1) {
                dragable_component_1 = dragable_component_1_1;
                exports_1({
                    "DraggableComponent": dragable_component_1_1["DraggableComponent"]
                });
            },
            function (dropzone_component_1_1) {
                dropzone_component_1 = dropzone_component_1_1;
                exports_1({
                    "DropzoneComponent": dropzone_component_1_1["DropzoneComponent"]
                });
            },
            function (icon_generator_component_1_1) {
                icon_generator_component_1 = icon_generator_component_1_1;
                exports_1({
                    "IconGenerator": icon_generator_component_1_1["IconGenerator"]
                });
            },
            function (toolbar_component_1_1) {
                toolbar_component_1 = toolbar_component_1_1;
                exports_1({
                    "ToolBarComponent": toolbar_component_1_1["ToolBarComponent"]
                });
            },
            function (date_picker_util_1_1) {
                exports_1({
                    "DatePickerUtil": date_picker_util_1_1["DatePickerUtil"]
                });
            }],
        execute: function() {
            //combined
            exports_1("COMPONENTS", COMPONENTS = [
                accordion_component_1.AccordionComponent,
                accordion_item_component_1.AccordionItemComponent,
                breadcrumbs_component_1.BreadcrumbsComponent,
                card_component_1.CardComponent,
                dropdown_component_1.DropdownComponent,
                dropdown_container_component_1.DropdownContainerComponent,
                date_picker_input_component_1.DatePickerInputComponent,
                date_picker_component_1.DatePickerComponent,
                time_picker_component_1.TimePickerComponent,
                datatable_component_1.DataTableComponent,
                column_component_1.ColumnComponent,
                column_template_loader_component_1.ColumnTemplateLoaderComponent,
                floating_action_button_component_1.FloatingActionButtonComponent,
                fancy_list_component_1.FANCY_LIST_DIRECTIVES,
                stepper_component_1.STEPPER_DIRECTIVES,
                hot_links_component_1.HotLinksComponent,
                single_image_component_1.SingleImageComponent,
                multiple_images_component_1.MultipleImagesComponent,
                modal_component_1.ModalComponent,
                pagination_component_1.PaginationComponent,
                searchbar_component_1.SearchbarComponent,
                snackbar_component_1.SnackbarComponent,
                tabs_component_1.TabsComponent,
                tab_component_1.TabComponent,
                vertical_menu_component_1.VerticalMenuComponent,
                auto_focus_input_directive_1.AutoFocusInputDirective,
                pagination_component_1.PaginationComponent,
                field_component_1.FieldComponent,
                tooltip_component_1.TooltipComponent,
                dragable_component_1.DraggableComponent,
                dropzone_component_1.DropzoneComponent,
                stopwatch_component_1.StopwatchComponent,
                icon_generator_component_1.IconGenerator,
                toolbar_component_1.ToolBarComponent
            ]);
        }
    }
});
