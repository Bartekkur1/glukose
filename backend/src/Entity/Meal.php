<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MealRepository")
 */
class Meal implements \JsonSerializable
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="meal")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\Column(type="integer")
     * @Assert\NotBlank(message = "Ilość kalorii nie może być pusta")
     */
    private $kcal;

    /**
     * @ORM\Column(type="integer")
     */
    private $fats;

    /**
     * @ORM\Column(type="integer")
     */
    private $carbohydrates;

    /**
     * @ORM\Column(type="datetime")
     * @Assert\NotBlank(message = "Data nie może być pusta")
     */
    private $date;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getKcal(): ?int
    {
        return $this->kcal;
    }

    public function setKcal(int $kcal): self
    {
        $this->kcal = $kcal;

        return $this;
    }

    public function getFats(): ?int
    {
        return $this->fats;
    }

    public function setFats(int $fats): self
    {
        $this->fats = $fats;

        return $this;
    }

    public function getCarbohydrates(): ?int
    {
        return $this->carbohydrates;
    }

    public function setCarbohydrates(int $carbohydrates): self
    {
        $this->carbohydrates = $carbohydrates;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function jsonSerialize() : array
    {
        return [
            "kcal" => $this->kcal,
            "fats" => $this->fats,
            "carbohydrates" => $this->carbohydrates,
            "date" => $this->date->format("Y-m-d H:i:s"),
            "id" => $this->id
        ];
    }
}
