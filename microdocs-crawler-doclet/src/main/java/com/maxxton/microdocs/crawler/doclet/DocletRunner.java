package com.maxxton.microdocs.crawler.doclet;

import com.maxxton.microdocs.crawler.Crawler;
import com.maxxton.microdocs.core.domain.Project;
import com.maxxton.microdocs.core.reflect.ReflectClass;
import com.maxxton.microdocs.core.writer.ConsoleWriter;
import com.maxxton.microdocs.core.writer.JsonWriter;
import com.maxxton.microdocs.core.writer.Writer;
import com.maxxton.microdocs.crawler.ErrorReporter;
import com.maxxton.microdocs.crawler.spring.SpringCrawler;
import com.sun.javadoc.RootDoc;
import com.sun.tools.doclets.standard.Standard;

import java.io.File;
import java.util.List;

/**
 * Start of the Doclet runner
 *
 * @author Steven Hermans
 */
public class DocletRunner extends Standard {

    private static Configuration config = new Configuration();

    public static boolean start(RootDoc root) {
        ErrorReporter.set(new DocletErrorReporter(root));
        config.options = root.options();

        // get crawler
        Crawler crawler = null;
        switch(config.getCrawler().toLowerCase()){
            case "spring":
                crawler = new SpringCrawler();
                break;
        }

        if(crawler == null){
            throw new IllegalArgumentException("Unknown crawler: " + config.getCrawler());
        }

        // convert Doclet classes to reflect classes
        List<ReflectClass<?>> classes = DocletConverter.convert(root.classes());

        // run crawler
        Project project = crawler.crawl(classes);

        // save result
        try {
            Writer writer = new JsonWriter();
            writer.write(project, new File(config.getOutputDirectory(), config.getOutputFileName()));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return true;
    }

    public static int optionLength(String option) {
        return config.getOptionLength(option);
    }

}
