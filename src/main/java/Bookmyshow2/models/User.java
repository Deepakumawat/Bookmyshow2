package Bookmyshow2.models;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class User extends BaseModel{

    private String name;
    private String email;
    private String password;
}