package Bookmyshow2.repositories;


import org.jetbrains.annotations.NotNull;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<SecurityProperties.User, Integer> {

    SecurityProperties.@NotNull User save(SecurityProperties.@NotNull User user);

    SecurityProperties.User findByEmail(String email);
}