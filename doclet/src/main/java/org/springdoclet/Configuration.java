package org.springdoclet;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author hermans.s
 */
public class Configuration {

    private static final String OPTION_DIRECTORY = "-d";
    private static final String OPTION_FILENAME = "-f";
    private static final String OPTION_STYLESHEET = "-stylesheet";
    private static final String OPTION_LINKPATH = "-linkpath";
    private static final String DEFAULT_DIRECTORY = ".";
    private static final String DEFAULT_FILENAME = "./spring-summary.html";
    private static final String DEFAULT_STYLESHEET = "./spring-summary.css";
    private static final String DEFAULT_LINKPATH = "./";

    // List of ignored options
    // TODO: Implement support for these since they are considered standard options
    private static final Map<String, Integer> IGNORED_OPTIONS = new HashMap();

    static {
        IGNORED_OPTIONS.put("-doctitle", 2);
        IGNORED_OPTIONS.put("-windowtitle", 2);
    }

    public String[][] options;

    public String getOutputDirectory() {
        return getOption(OPTION_DIRECTORY) != null ? getOption(OPTION_DIRECTORY) : DEFAULT_DIRECTORY;
    }

    public String getOutputFileName() {
        return getOption(OPTION_FILENAME) != null ? getOption(OPTION_FILENAME) : DEFAULT_FILENAME;
    }

    public String getStyleSheet() {
        return getOption(OPTION_STYLESHEET) != null ? getOption(OPTION_STYLESHEET) : DEFAULT_STYLESHEET;
    }

    public boolean isDefaultStyleSheet() {
        return getStyleSheet().equals(DEFAULT_STYLESHEET);
    }

    private String getOption(String optionName) {
        for (String[] option : options) {
            if (option[0].equals(optionName)) {
                return option[1];
            }
        }
        return null;
    }

    public int getOptionLength(String option) {
        if (option.equals(OPTION_DIRECTORY)) {
            return 2;
        } else if (option.equals(OPTION_FILENAME)) {
            return 2;
        } else if (option.equals(OPTION_STYLESHEET)) {
            return 2;
        } else if (option.equals(OPTION_LINKPATH)) {
            return 2;
        } else if (IGNORED_OPTIONS.containsKey(option)) {
            return IGNORED_OPTIONS.get(option);
        }
        return 0;
    }
}
