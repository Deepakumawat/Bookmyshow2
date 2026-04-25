package Bookmyshow2.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaRoutingConfig {

    @RequestMapping(value = {"/", "/{path:^(?!api|actuator|h2-console|error|index\\.html).*}", "/{path:^(?!api|actuator|h2-console|error|index\\.html).*}/**"})
    public String forward() {
        return "forward:/index.html";
    }
}
