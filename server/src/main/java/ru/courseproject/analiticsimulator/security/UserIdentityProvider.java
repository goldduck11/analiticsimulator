package ru.courseproject.analiticsimulator.security;

import io.quarkus.security.AuthenticationFailedException;
import io.quarkus.security.identity.AuthenticationRequestContext;
import io.quarkus.security.identity.IdentityProvider;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.identity.request.UsernamePasswordAuthenticationRequest;
import io.quarkus.security.runtime.QuarkusPrincipal;
import io.quarkus.security.runtime.QuarkusSecurityIdentity;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import org.mindrot.jbcrypt.BCrypt;
import ru.courseproject.analiticsimulator.user.account.model.User;
import ru.courseproject.analiticsimulator.user.account.repository.UserRepository;

@ApplicationScoped
public class UserIdentityProvider implements IdentityProvider<UsernamePasswordAuthenticationRequest> {

    private final UserRepository userRepository;

    public UserIdentityProvider(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Class<UsernamePasswordAuthenticationRequest> getRequestType() {
        return UsernamePasswordAuthenticationRequest.class;
    }

    @Override
    public Uni<SecurityIdentity> authenticate(UsernamePasswordAuthenticationRequest request,
                                              AuthenticationRequestContext context) {
        String emailOrUsername = request.getUsername();
        String rawPassword = new String(request.getPassword().getPassword());
        User user = userRepository.findByEmailOrUsername(emailOrUsername, emailOrUsername);

        if (user == null || !BCrypt.checkpw(rawPassword, user.getPassword())) {
            throw new AuthenticationFailedException();
        }

        QuarkusSecurityIdentity.Builder builder = QuarkusSecurityIdentity.builder();
        builder.setPrincipal(new QuarkusPrincipal(user.getEmail()));
        builder.addRole(user.getRole());
        return Uni.createFrom().item(builder.build());
    }
}
