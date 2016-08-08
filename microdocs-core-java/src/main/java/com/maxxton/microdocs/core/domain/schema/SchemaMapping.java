package com.maxxton.microdocs.core.domain.schema;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Steven Hermans
 */
public class SchemaMapping {

    private boolean ignore = false;
    private String name;
    private boolean primary = false;
    private List<String> tables = new ArrayList();

    public boolean isIgnore() {
        return ignore;
    }

    public void setIgnore(boolean ignore) {
        this.ignore = ignore;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getTables() {
        return tables;
    }

    public void setTables(List<String> tables) {
        this.tables = tables;
    }

    public boolean isPrimary() {
        return primary;
    }

    public void setPrimary(boolean primary) {
        this.primary = primary;
    }
}
