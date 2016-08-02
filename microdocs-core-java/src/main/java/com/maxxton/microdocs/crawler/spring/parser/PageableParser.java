package com.maxxton.microdocs.crawler.spring.parser;

import com.maxxton.microdocs.core.collector.SchemaCollector;
import com.maxxton.microdocs.core.domain.path.Parameter;
import com.maxxton.microdocs.core.domain.path.ParameterPlacing;
import com.maxxton.microdocs.core.domain.schema.SchemaType;
import com.maxxton.microdocs.core.reflect.ReflectMethod;
import com.maxxton.microdocs.core.reflect.ReflectParameter;
import com.maxxton.microdocs.crawler.spring.collector.RequestParser;
import com.maxxton.microdocs.core.domain.path.ParameterVariable;
import com.maxxton.microdocs.core.reflect.ReflectClass;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Steven Hermans
 */
public class PageableParser implements RequestParser {
    @Override
    public String getClassName() {
        return "org.springframework.data.domain.Pageable";
    }

    @Override
    public List<Parameter> parse(ReflectParameter reflectParameter, ReflectClass controller, ReflectMethod method, SchemaCollector schemaCollector) {
        List<Parameter> parameters = new ArrayList();

        ParameterVariable page = new ParameterVariable();
        page.setName("page");
        page.setIn(ParameterPlacing.QUERY);
        page.setDefaultValue(0);
        page.setType(SchemaType.INTEGER);
        page.setDescription("page number");
        parameters.add(page);

        ParameterVariable size = new ParameterVariable();
        size.setName("size");
        size.setIn(ParameterPlacing.QUERY);
        size.setDefaultValue(20);
        size.setType(SchemaType.INTEGER);
        size.setDescription("items per page");
        parameters.add(size);

        ParameterVariable sort = new ParameterVariable();
        sort.setName("sort");
        sort.setIn(ParameterPlacing.QUERY);
        sort.setDefaultValue("asc");
        sort.setType(SchemaType.STRING);
        sort.setDescription("sort option");
        parameters.add(sort);

        return parameters;
    }
}
