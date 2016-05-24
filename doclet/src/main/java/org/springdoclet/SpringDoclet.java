package org.springdoclet;

import com.sun.javadoc.RootDoc;
import com.sun.tools.doclets.standard.Standard;
import org.springdoclet.collectors.ComponentCollector;
import org.springdoclet.collectors.ModelCollector;
import org.springdoclet.collectors.RequestMappingCollector;
import org.springdoclet.writers.JsonWriter;

/**
 *
 * @author hermans.s
 */
public class SpringDoclet extends Standard {

    private static Configuration config = new Configuration();

    public static boolean start(RootDoc root) {
        ErrorReporter.setErrorReporter(root);
        config.options = root.options();

        ComponentCollector componentCollector = new ComponentCollector();
        ModelCollector modelCollector = new ModelCollector();
        RequestMappingCollector requestMappingCollector = new RequestMappingCollector(modelCollector);
        Collector[] collectors = new Collector[]{componentCollector, requestMappingCollector, modelCollector};

        new ClassProcessor().process(root.classes(), collectors);

        try {
            new JsonWriter().writeJson(requestMappingCollector, modelCollector, componentCollector, config);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

//    new HtmlWriter().writeOutput(collectors, config)
//
//    if (config.isDefaultStyleSheet()) {
//      new StylesheetWriter().writeStylesheet config
//    }
        return true;
    }

    public static int optionLength(String option) {
        return config.getOptionLength(option);
    }
}
