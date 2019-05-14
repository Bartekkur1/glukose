<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User implements UserInterface, \Serializable
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=191, unique=true)
     * @Assert\NotBlank(message = "Login nie może być pusty")
     * @Assert\Length(
     *      min = 5,
     *      minMessage = "Login musi mieć przynajmniej {{ limit }} znaków",
     * )
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=191)
     * @Assert\NotBlank(message = "Hasło nie może być puste")
     * @Assert\Length(
     *      min = 6,
     *      minMessage = "Hasło musi mieć przynajmniej {{ limit }} znaków",
     * )
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=191, unique=true)
     * @Assert\Email(
     *     message = "Podany email nie jest poprawny",
     * )
     */
    private $email;

    /** 
     * @ORM\Column(type="string", length=512)
     */
    private $token;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Sugar", mappedBy="user_id")
     */
    private $sugar;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Meal", mappedBy="user")
     */
    private $meal;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Dose", mappedBy="user")
     */
    private $dose;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\UserInfo", mappedBy="user", cascade={"persist", "remove"})
     */
    private $userInfo;

    public function __construct()
    {
        $this->sugar = new ArrayCollection();
        $this->meal = new ArrayCollection();
        $this->dose = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

    public function getRoles() 
    {
        return [
            "ROLE_USER"
        ];
    }
    public function getSalt() 
    {
        return null;
    }

    public function eraseCredentials()
    {

    }

    public static function fromRegisterForm($data)
    {
        $user = new User();
        $user->setUsername($data["username"]);
        $user->setEmail($data["email"]);
        $user->setToken("");
        return $user;
    }

    public function serialize()
    {
        return serialize([
            $this->id,
            $this->username,
            $this->email,
            $this->password,
            // $this->token
        ]);
    }

    public function unserialize($serialized)
    {
        list($this->id,
            $this->username,
            $this->email,
            $this->password) = unserialize($serialized);
    }

    /**
     * @return Collection|Sugar[]
     */
    public function getSugar(): Collection
    {
        return $this->sugar;
    }

    public function addSugar(Sugar $sugar): self
    {
        if (!$this->sugar->contains($sugar)) {
            $this->sugar[] = $sugar;
            $sugar->setUserId($this);
        }

        return $this;
    }

    public function removeSugar(Sugar $sugar): self
    {
        if ($this->sugar->contains($sugar)) {
            $this->sugar->removeElement($sugar);
            if ($sugar->getUserId() === $this) {
                $sugar->setUserId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Meal[]
     */
    public function getMeal(): Collection
    {
        return $this->meal;
    }

    public function addMeal(Meal $meal): self
    {
        if (!$this->meal->contains($meal)) {
            $this->meal[] = $meal;
            $meal->setUser($this);
        }

        return $this;
    }

    public function removeMeal(Meal $meal): self
    {
        if ($this->meal->contains($meal)) {
            $this->meal->removeElement($meal);
            // set the owning side to null (unless already changed)
            if ($meal->getUser() === $this) {
                $meal->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Dose[]
     */
    public function getDose(): Collection
    {
        return $this->dose;
    }

    public function addDose(Dose $dose): self
    {
        if (!$this->dose->contains($dose)) {
            $this->dose[] = $dose;
            $dose->setUser($this);
        }

        return $this;
    }

    public function removeDose(Dose $dose): self
    {
        if ($this->dose->contains($dose)) {
            $this->dose->removeElement($dose);
            // set the owning side to null (unless already changed)
            if ($dose->getUser() === $this) {
                $dose->setUser(null);
            }
        }

        return $this;
    }

    public function getUserInfo(): ?UserInfo
    {
        return $this->userInfo;
    }

    public function setUserInfo(UserInfo $userInfo): self
    {
        $this->userInfo = $userInfo;

        // set the owning side of the relation if necessary
        if ($this !== $userInfo->getUser()) {
            $userInfo->setUser($this);
        }

        return $this;
    }
}
