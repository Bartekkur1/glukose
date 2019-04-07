<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserInfoRepository")
 */
class UserInfo implements \JsonSerializable
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\User", inversedBy="userInfo", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\Column(type="integer")
     */
    private $age;

    /**
     * @ORM\Column(type="string", length=64)
     */
    private $gender;

    /**
     * @ORM\Column(type="integer")
     */
    private $height;

    /**
     * @ORM\Column(type="integer")
     */
    private $weight;

    /**
     * @ORM\Column(type="string", length=128)
     */
    private $insulinType;

    /**
     * @ORM\Column(type="string", length=128)
     */
    private $dailyInsulinType;

    /**
     * @ORM\Column(type="integer", length=64)
     */
    private $dailyInsulinAmount;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getAge(): ?int
    {
        return $this->age;
    }

    public function setAge(int $age): self
    {
        $this->age = $age;

        return $this;
    }

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function setGender(string $gender): self
    {
        $this->gender = $gender;

        return $this;
    }

    public function getHeight(): ?int
    {
        return $this->height;
    }

    public function setHeight(int $height): self
    {
        $this->height = $height;

        return $this;
    }

    public function getWeight(): ?int
    {
        return $this->weight;
    }

    public function setWeight(int $weight): self
    {
        $this->weight = $weight;

        return $this;
    }

    public function getInsulinType(): ?string
    {
        return $this->insulinType;
    }

    public function setInsulinType(string $insulinType): self
    {
        $this->insulinType = $insulinType;

        return $this;
    }

    public function getDailyInsulinType(): ?string
    {
        return $this->dailyInsulinType;
    }

    public function setDailyInsulinType(string $dailyInsulinType): self
    {
        $this->dailyInsulinType = $dailyInsulinType;

        return $this;
    }

    public function getDailyInsulinAmount(): ?int
    {
        return $this->dailyInsulinAmount;
    }

    public function setDailyInsulinAmount(int $dailyInsulinAmount): self
    {
        $this->dailyInsulinAmount = $dailyInsulinAmount;

        return $this;
    }

    public function jsonSerialize() : array
    {
        return [
            "age" => $this->age,
            "gender" => $this->gender,
            "height" => $this->height,
            "weight" => $this->weight,
            "insulinType" => $this->insulinType,
            "dailyInsulinType" => $this->dailyInsulinType,
            "dailyInsulinAmount" => $this->dailyInsulinAmount,
        ];
    }
}
