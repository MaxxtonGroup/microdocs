package com.maxxton.microdocs.jenkins;

import java.util.Random;

/**
 * Funny Quote generator
 * source: https://dzone.com/articles/the-ultimate-list-of-100-software-testing-quotes-2
 * @author Steven Hermans
 */
public class QuoteGenerator {

  private static final String[] QUOTES = new String[]{
      "Only conducting performance testing at the conclusion of system or functional testing is like conducting a diagnostic blood test on a patient who is already dead",
      "Because it's automated, doesn't mean it works",
      "Success is the result of perfection, hard work, learning from failure, loyalty, and persistence",
      "A woman's mind is cleaner than a man's: She changes it more often",
      "The man who makes no mistakes does not usually make anything",
      "Anyone who doesn't make mistakes isn't trying hard enough",
      "Quality is free, but only to those who are willing to pay heavily for it",
      "The bitterness of poor quality remains long after the sweetness of low price is forgotten",
      "Quality is not an act, it is a habit",
      "Software never was perfect and won't get perfect. But is that a license to create garbage? The missing ingredient is our reluctance to quantify quality",
      "Geeks are people who love something so much that all the details matter",
      "Be a yardstick of quality. Some people aren't used to an environment where excellence is expected",
      "…Quality debt focuses on the impact of implementation and quality decisions on the end user and business; how those decisions affect their ability to do their day-to day-job",
      "Quality means doing it right even when no one is looking",
      "Fast, good, cheap: pick any two",
      "Testers don't like to break things; they like to dispel the illusion that things work",
      "You can see a lot by just looking",
      "Pretty good testing is easy to do (that's partly why some people like to say 'testing is dead'– they think testing isn't needed as a special focus because they note that anyone can find at least some bugs some of the time). Excellent testing is quite hard to do",
      "A pinch of probability is worth a pound of perhaps",
      "Testing is not responsible for the bugs inserted into software any more than the sun is responsible for creating dust in the air",
      "To those who say that 'if you need testing at the end, you're doing it wrong', would you prefer a Boeing, or are you going Air Icarus?",
      "The problem is not that testing is the bottleneck. The problem is that you don't know what's in the bottle. That's a problem that testing addresses",
      "I am pretty sure there is a difference between \"this has not been proven\" and \"this is false\"",
      "Testing is a skill. While this may come as a surprise to some people it is a simple fact",
      "You can be a great tester if you have programming skills. You can also be a great tester if you have no programming skills at all. And, you can be a lousy tester with or without programming skills. A great tester will learn what skills she needs to continue to be great, in her own style",
      "No amount of testing can prove a software right, a single test can prove a software wrong",
      "Discovering the unexpected is more important than confirming the known",
      "The most exciting phrase to hear in science, the one that heralds discoveries, is not 'Eureka!' but 'Now that's funny…'",
      "Testing is an infinite process of comparing the invisible to the ambiguous in order to avoid the unthinkable happening to the anonymous",
      "The more effort I put into testing the product conceptually at the start of the process, the less I effort I had to put into manually testing the product at the end because less bugs would emerge as a result",
      "I do believe it's important for testers to know the market that their client or their employer is in and the reason for that is if you understand what risks your client is facing and you understand what the competing products are and where the challenges lie in the market, you can plan your testing accordingly",
      "I think when you hear the phrase 'it's just test code'. To me that's a code smell",
      "Testers don't break software, software is already broken",
      "Documents are the corpse of knowledge",
      "Just because you've counted all the trees doesn't mean you've seen the forest",
      "As a rule, software systems do not work well until they have been used, and have failed repeatedly, in real applications",
      "It's not at all important to get it right the first time. It's vitally important to get it right the last time.",
      "Simple systems are not feasible because they require infinite testing",

      "If we want to be serious about quality, it is time to get tired of finding bugs and start preventing their happening in the first place",
      "More than the act of testing, the act of designing tests is one of the best bug preventers known",
      "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it",
      "When debugging, novices insert corrective code; experts remove defective code",
      "It's hard enough to find an error in your code when you're looking for it; it's even harder when you've assumed your code is error-free",
      "Beware of bugs in the above code; I have only proved it correct, not tried it"
  };

  private static Random random = new Random();

  public static String randomQuote(){
    int index = random.nextInt(QUOTES.length);
    return "'" + QUOTES[index] + "'";
  }

}
